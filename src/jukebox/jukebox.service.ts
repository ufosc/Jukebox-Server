import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { randomUUID } from 'crypto'
import { SpotifyService } from 'src/spotify/spotify.service'
import { Not, Repository } from 'typeorm'
import { SpotifyAccount } from '../spotify/entities/spotify-account.entity'
import { AddJukeboxLinkDto } from './dto/add-jukebox-link.dto'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { CreateJukeboxInteractionDto, JukeboxInteractionDto } from './dto/jukebox-interaction.dto'
import { JukeboxLinkDto } from './dto/jukebox-link.dto'
import { TrackInteraction } from './dto/like-dislike-track.dto'
import { PlayerStateDto, PlayerStateUpdateDto } from './dto/player-state.dto'
import { QueuedTrackDto } from './dto/track.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { Jukebox, JukeboxLinkAssignment } from './entities/jukebox.entity'
import { TrackQueueService } from './track-queue/track-queue.service'

@Injectable()
export class JukeboxService {
  private cacheTtlMs = 60000

  constructor(
    @InjectRepository(Jukebox) private repo: Repository<Jukebox>,
    @InjectRepository(JukeboxLinkAssignment)
    private assignmentRepo: Repository<JukeboxLinkAssignment>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private spotifySvc: SpotifyService,
    private queueSvc: TrackQueueService,
  ) {}

  create(createJukeboxDto: CreateJukeboxDto) {
    const jukebox = this.repo.create(createJukeboxDto)
    return this.repo.save(jukebox)
  }

  findAll() {
    return this.repo.find({
      relations: ['link_assignments', 'link_assignments.spotify_link'],
    })
  }

  findClubJbxs(clubID: number) {
    return this.repo.find({
      relations: ['link_assignments', 'link_assignments.spotify_link'],
      where: { club_id: clubID },
    })
  }

  async findOne(id: number) {
    const jukebox = await this.repo.findOne({
      where: { id },
      relations: ['link_assignments', 'link_assignments.spotify_link'],
    })
    if (!jukebox) {
      throw new NotFoundException('Jukebox not found')
    }

    return jukebox
  }

  async update(id: number, updateJukeboxDto: UpdateJukeboxDto) {
    const jukebox = await this.findOne(id)

    if (!jukebox) {
      throw new NotFoundException(`Jukebox with id ${id} not found`)
    }

    Object.assign(jukebox, updateJukeboxDto)

    this.repo.save(jukebox)

    return jukebox
  }

  async remove(id: number) {
    const jukebox = await this.findOne(id)

    if (!jukebox) {
      throw new NotFoundException(`Jukebox with id ${id} not found`)
    }

    await this.repo.delete({ id })

    return jukebox
  }

  async getJukeboxLinks(jukeboxId: number): Promise<JukeboxLinkDto[]> {
    const jukebox = await this.findOne(jukeboxId)

    return jukebox.link_assignments.map((assignment) => assignment.serialize())
  }

  async findJukeboxLink(jukeboxId: number, jukeboxLink: AddJukeboxLinkDto) {
    const link = await this.assignmentRepo.findOne({
      where: {
        jukebox_id: jukeboxId,
        spotify_link: { spotify_email: jukeboxLink.email },
      },
    })

    if (!link) {
      throw new NotFoundException(`Jukebox link not found with email ${jukeboxLink.email}.`)
    }

    return link
  }

  async removeJukeboxLink(jukeboxId: number, linkId: number) {
    const link = await this.assignmentRepo.findOne({ where: { jukebox_id: jukeboxId, id: linkId } })
    if (!link) {
      throw new NotFoundException(`Jukebox link not found with id ${linkId}.`)
    }

    await this.assignmentRepo.delete({ jukebox_id: jukeboxId, id: linkId })

    return link
  }

  async setActiveLink(jukeboxId: number, linkId: number) {
    await this.assignmentRepo.update(
      { jukebox_id: jukeboxId, active: true, id: Not(linkId) },
      { active: false },
    )
    const assignment = await this.assignmentRepo.findOne({
      where: { jukebox_id: jukeboxId, id: linkId },
      relations: ['spotify_link'],
    })

    if (!assignment) {
      throw new NotFoundException('Spotify assignment not found.')
    }

    assignment.active = true
    await assignment.save()

    return assignment
  }

  async getActiveLink(jukeboxId: number): Promise<JukeboxLinkDto | null> {
    const jukebox = await this.findOne(jukeboxId)
    const assignment = jukebox.link_assignments.find((lnk) => lnk.active)

    if (!assignment) {
      return null
    }

    return assignment.serialize()
  }

  async addLinkToJukebox(jukeboxId: number, spotifyLink: SpotifyAccount): Promise<JukeboxLinkDto> {
    const jukebox = await this.findOne(jukeboxId)

    const assignment = this.assignmentRepo.create({
      jukebox_id: jukebox.id,
      jukebox: jukebox,
      spotify_link_id: spotifyLink.id,
      spotify_link: spotifyLink,
      active: true,
    })

    const record = await this.assignmentRepo.save(assignment)
    await this.setActiveLink(jukebox.id, record.id)

    return assignment.serialize()
  }

  async getActiveSpotifyAccount(jukeboxId: number): Promise<SpotifyAccount> {
    const jukebox = await this.findOne(jukeboxId)
    const assignment = jukebox.link_assignments.find((lnk) => lnk.active)

    // TODO: Handle non spotify accounts?
    if (!assignment) {
      throw new BadRequestException('Cannot connect to spotify, no active linked accounts.')
    }

    return assignment.spotify_link
  }
  // ================
  // Player Methods
  // ================
  private getCacheKey(jukeboxId: number, label: 'player-state') {
    return `${label}-${jukeboxId}`
  }

  private async setPlayerState(jukeboxId: number, playerState: PlayerStateDto) {
    const key = this.getCacheKey(jukeboxId, 'player-state')
    await this.cache.set(key, playerState)
  }

  async getPlayerState(jukeboxId: number): Promise<PlayerStateDto | null> {
    const key = this.getCacheKey(jukeboxId, 'player-state')
    const playerState = await this.cache.get<PlayerStateDto>(key)

    // return playerState ?? null
    return (
      playerState ?? {
        is_playing: false,
        jukebox_id: jukeboxId,
        progress: 0,
        current_track: undefined,
      }
    )
  }

  async convertToQueuedTrack(
    jukeboxId: number,
    track: ITrack | IPlayerTrack,
  ): Promise<IQueuedTrack> {
    const trackId = track.id ?? ('uid' in track ? track.uid : '')
    const account = await this.getActiveSpotifyAccount(jukeboxId)

    const fullTrack = await this.spotifySvc.getTrack(account, trackId)
    const queuedTrack: IQueuedTrack = {
      track: fullTrack,
      queue_id: randomUUID(),
      interactions: {
        likes: 0,
        dislikes: 0,
      },
    }

    return queuedTrack
  }

  /**
   * Set new track as currently playing.
   * Reset player state attributes.
   */
  async setCurrentTrack(jukeboxId: number, track: ITrack | IPlayerTrack | IQueuedTrack) {
    let queuedTrack: IQueuedTrack

    if ('track' in track) {
      // Track is already a QueuedTrack, only QueuedTracks have attribute 'track'
      queuedTrack = track
    } else {
      // Otherwise, request data from spotify
      queuedTrack = await this.convertToQueuedTrack(jukeboxId, track)
    }

    await this.updatePlayerState(jukeboxId, {
      current_track: queuedTrack,
      is_playing: false,
      progress: 0,
    })
  }

  async updatePlayerState(jukeboxId: number, payload: Partial<PlayerStateUpdateDto>) {
    const currentState = await this.getPlayerState(jukeboxId)
    let nextState: IPlayerState | null = currentState

    if (!nextState) {
      nextState = {
        jukebox_id: jukeboxId,
        progress: 0,
        is_playing: false,
      }
    }

    Object.assign(nextState, payload)
    await this.setPlayerState(jukeboxId, nextState)

    return nextState
  }

  /**
   * Record an interaction for a track in the queue, or in
   * the currently player state.
   */
  async doInteraction(
    jukeboxId,
    user: IUser,
    payload: CreateJukeboxInteractionDto,
  ): Promise<JukeboxInteractionDto> {
    const { action, queue_index } = payload

    /** Helper function to handle interaction */
    const interact = (track: QueuedTrackDto) => {
      switch (action) {
        case 'like':
          track.interactions.likes += 1
          break
        case 'dislike':
          track.interactions.dislikes += 1
          break
        default:
          throw new NotImplementedException(`Interaction not implemented: ${action}`)
      }

      return track
    }

    if (queue_index === 0) {
      // Modify currently player track
      const state = await this.getPlayerState(jukeboxId)
      if (!state?.current_track) {
        throw new BadRequestException('Cannot like empty current track')
      }
      const updatedTrack = interact(state.current_track)
      state.current_track = updatedTrack

      await this.setPlayerState(jukeboxId, state)
    } else {
      // Modify track in queue
      if (queue_index === undefined) {
        throw new BadRequestException(
          'Must include queue index if adding an interaction to the queue.',
        )
      }

      const queuedTrack = await this.queueSvc.getTrackAtPos(jukeboxId, queue_index)
      if (!queuedTrack) {
        throw new BadRequestException(`Cannot like empty track in queue at position ${queue_index}`)
      }

      const updatedTrack = interact(queuedTrack)
      await this.queueSvc.setTrackAtPos(jukeboxId, updatedTrack, queue_index)
    }

    return {
      jukebox_id: jukeboxId,
      user,
      action,
      queue_index,
    }
  }

  /**
   * Pop top track in queue, add to player.
   * Queue up next track in queue to spotify.
   *
   * Returns gracefully if there is no current track, or next track.
   */
  async shiftNextTrack(jukeboxId: number) {
    // const playerState = await this.getPlayerState(jukeboxId)
    const currentTrack = await this.queueSvc.popTrack(jukeboxId)
    const nextTrack = await this.queueSvc.peekNextTrack(jukeboxId)

    // Add current track to queue
    if (!currentTrack) return
    await this.setCurrentTrack(jukeboxId, currentTrack)

    // Preload next track with spotify's queue
    if (!nextTrack?.track) return
    const account = await this.getActiveSpotifyAccount(jukeboxId)
    await this.spotifySvc.queueTrack(account, nextTrack?.track.uri)
    await this.queueSvc.flagNextTrackAsQueued(jukeboxId)
  }

  /**
   * Get track queue for a jukebox.
   *
   * @param fallbackUserQueue If our stored queue is empty, fetch the default user queue
   * from spotify and return that instead.
   */
  async getTrackQueue(jukeboxId: number, fallbackUserQueue = false): Promise<IQueuedTrack[]> {
    let queue = await this.queueSvc.getTrackQueue(jukeboxId)

    if (queue.length === 0 && fallbackUserQueue) {
      const account = await this.getActiveSpotifyAccount(jukeboxId)
      const defaultQueue = await this.spotifySvc.getQueue(account)

      queue = defaultQueue.queue.map((track) => ({
        track: track as ITrackDetails,
        queue_id: randomUUID(),
        interactions: {
          likes: 0,
          dislikes: 0,
        },
      }))
    }

    return queue
  }

  async getNextQueuedTrack(jukeboxId: number): Promise<IQueuedTrack | null> {
    const queue = await this.getTrackQueue(jukeboxId)
    if (queue.length < 1) return null

    return queue[0]
  }

  /**
   * Peeks at the next track in the queue,
   * and returns true if the player track id matches
   * the next track.
   */
  async playerTrackIsNext(jukeboxId: number, track: IPlayerTrack): Promise<boolean> {
    const nextTrack = await this.getNextQueuedTrack(jukeboxId)
    return nextTrack?.track.id === track.id
  }

  /**
   * Add track to queue.
   *
   * If queue is empty, then also queue up track with spotify.
   */
  async addTrackToQueue(
    jukeboxId: number,
    trackId: string,
    meta: { username: string },
  ): Promise<IQueuedTrack> {
    const account = await this.getActiveSpotifyAccount(jukeboxId)
    const track = await this.spotifySvc.getTrack(account, trackId)

    const queuedTrack = await this.queueSvc.queueTrack(jukeboxId, track, meta.username)
    const queue = await this.queueSvc.getTrackQueue(jukeboxId)
    console.log('queue:', queue)

    if (queue.length === 1) {
      await this.spotifySvc.queueTrack(account, track.uri)
    }

    return queuedTrack
  }

  async interactWithTrackInQueue(
    jukeboxId: number,
    queueIndex: number,
    action: TrackInteraction,
  ): Promise<IQueuedTrack> {
    // Get the track at the specified position
    const track = await this.queueSvc.getTrackAtPos(jukeboxId, queueIndex)

    if (!track) {
      throw new BadRequestException(`No track found at position ${queueIndex} in the queue.`)
    }

    // Update likes or dislikes
    if (action === TrackInteraction.LIKE) {
      track.interactions.likes += 1
    } else if (action === TrackInteraction.DISLIKE) {
      track.interactions.dislikes += 1
    }

    // Save the updated track back to the queue
    await this.queueSvc.setTrackAtPos(jukeboxId, track, queueIndex)

    return track
  }
}
