import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { UserDto } from 'src/shared'
import { SpotifyService } from 'src/spotify/spotify.service'
import { TrackDto } from 'src/track/dto/track.dto'
import { Repository } from 'typeorm'
import { AccountLinkService } from '../account-link/account-link.service'
import { QueuedTrackDto } from '../queue/dto'
import { QueueService } from '../queue/queue.service'
import { ActionType, PlayerActionDto, PlayerStateDto, SetPlayerDeviceDto } from './dto'
import { InteractionType, PlayerInteraction } from './entity/player-interaction.entity'

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerInteraction) private repo: Repository<PlayerInteraction>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private spotifyService: SpotifyService,
    private accountLinkService: AccountLinkService,
    private queueService: QueueService,
  ) {}

  private async setPlayerState(jukeboxId: number, payload: PlayerStateDto) {
    await this.cache.set(`jukebox-${jukeboxId}`, payload)
  }

  private async updatePlayerState(
    jukeboxId: number,
    payload: Partial<PlayerStateDto> | ((state: PlayerStateDto) => PlayerStateDto),
  ) {
    const currentState = await this.getPlayerState(jukeboxId)
    let updatedState: PlayerStateDto

    if (typeof payload === 'function') {
      updatedState = payload(currentState)
    } else {
      updatedState = { ...currentState, ...payload }
    }

    await this.setPlayerState(jukeboxId, updatedState)

    return updatedState
  }

  /**
   * Get or Create the player state for a jukebox.
   */
  async getPlayerState(jukeboxId: number): Promise<PlayerStateDto> {
    let cachedState = await this.cache.get<PlayerStateDto>(`jukebox-${jukeboxId}`)

    if (!cachedState) {
      cachedState = {
        jukebox_id: jukeboxId,
        is_playing: false,
        last_progress_update: new Date(),
        progress: 0,
      }
      await this.setPlayerState(jukeboxId, cachedState)
    }

    // if (cachedState.queued_track) {
    //   const qt = await this.queueService.getQueuedTrackById(cachedState.queued_track.id)

    // }

    return cachedState
  }

  /**
   * Transfer playback to the device with id in spotify.
   * Save this id as the current device id in the player state.
   */
  async setPlayerDeviceId(jukeboxId: number, payload: SetPlayerDeviceDto): Promise<PlayerStateDto> {
    const { device_id } = payload
    const activeAccount = await this.accountLinkService.getActiveAccount(jukeboxId)
    await this.spotifyService.setPlayerDevice(activeAccount.spotify_account, device_id)
    return await this.updatePlayerState(jukeboxId, { current_device_id: device_id })
  }

  /**
   * Sets the progress in the player state so all
   * clients get most accurate progress.
   */
  async setCurrentProgress(
    jukeboxId: number,
    progress: number,
    timestamp?: Date,
  ): Promise<PlayerStateDto> {
    const cachedState = await this.getPlayerState(jukeboxId)
    cachedState.progress = progress
    cachedState.last_progress_update = timestamp || new Date()

    await this.setPlayerState(jukeboxId, cachedState)
    return cachedState
  }

  /**
   * A user either like/disliked the currently playing track.
   * Create interaction and update the player.
   */
  async addInteraction(
    jukeboxId: number,
    user: UserDto,
    interaction_type: InteractionType,
  ): Promise<PlayerStateDto> {
    const { queued_track } = await this.getPlayerState(jukeboxId)

    if (!queued_track)
      throw new BadRequestException(
        'Cannot interact with the player if a queued track is not playing.',
      )

    this.repo.create({
      queued_track: { id: queued_track.id },
      user_id: user.id,
      interaction_type,
    })

    return await this.updatePlayerState(jukeboxId, (state) => {
      if (interaction_type === InteractionType.LIKE) {
        return {
          ...state,
          queued_track: { ...state.queued_track!, likes: state.queued_track!.likes + 1 },
        }
      } else {
        return {
          ...state,
          queued_track: { ...state.queued_track!, dislikes: state.queued_track!.dislikes + 1 },
        }
      }
    })
  }

  /**
   * Set whether the current track is playing.
   */
  async setIsPlaying(jukeboxId: number, isPlaying: boolean): Promise<PlayerStateDto> {
    return await this.updatePlayerState(jukeboxId, { is_playing: isPlaying })
  }

  /**
   * Sets a track that wasn't in the queue as currently playing.
   * This is needed when the queue is empty and a new track starts playing
   * because of Spotify auto play, or because a user manually set the
   * current track in spotify despite the queue.
   */
  async setCurrentSpotifyTrack(jukeboxId: number, track: TrackDto | null): Promise<PlayerStateDto> {
    return await this.updatePlayerState(jukeboxId, { spotify_track: track ?? undefined })
  }

  /**
   * Sets a track from the queue to currently playing. This happens
   * when a track ends and the next track that starts playing is
   * the same track that was at the top of the queue.
   */
  async setCurrentQueuedTrack(jukeboxId: number, track: QueuedTrackDto): Promise<PlayerStateDto> {
    return await this.updatePlayerState(jukeboxId, { queued_track: track })
  }

  // /**
  //  * Set the next track in the queue as currently playing. Connects
  //  * to QueueService to pop the track and set it as current track
  //  * using `setCurrentQueuedTrack`.
  //  */
  // async playNextQueuedTrack(jukeboxId: number): Promise<PlayerStateDto> {
  //   throw new NotImplementedException()
  // }

  /**
   * Change the playback state of the player in spotify,
   * update player state cache.
   */
  async executeAction(jukeboxId: number, action: PlayerActionDto) {
    const { action_type } = action
    const { current_device_id, juke_session_id } = await this.getPlayerState(+jukeboxId)

    if (!current_device_id) {
      throw new BadRequestException('Current device is not set, transfer playback to control audio')
    }
    const activeAccount = await this.accountLinkService.getActiveAccount(jukeboxId)
    const { spotify_account } = activeAccount

    switch (action_type) {
      case ActionType.PLAY:
        await this.spotifyService.startPlayback(spotify_account, current_device_id)
        await this.setIsPlaying(+jukeboxId, true)
        break
      case ActionType.PAUSE:
        await this.spotifyService.pausePlayback(spotify_account, current_device_id)
        await this.setIsPlaying(+jukeboxId, false)
        break
      case ActionType.NEXT:
        if (!juke_session_id) {
          await this.spotifyService.skipNext(spotify_account, current_device_id)
          break
        }

        // Get next track, the ws will pop it when it starts playing
        const nextTrack = await this.queueService.getNextTrack(jukeboxId)

        if (!nextTrack) {
          await this.spotifyService.skipNext(spotify_account, current_device_id)
        } else {
          await this.spotifyService.playTrack(
            spotify_account,
            current_device_id,
            nextTrack.track.spotify_uri,
          )
        }
        // The player on the client side will record a track change, setting
        // the current track of the cached player via ws.
        break
      case ActionType.PREVIOUS:
        await this.spotifyService.skipPrevious(spotify_account, current_device_id)
        break
      case ActionType.LOOP:
        await this.spotifyService.loopPlayback(spotify_account, current_device_id)
        break
    }

    return this.getPlayerState(jukeboxId)
  }
}
