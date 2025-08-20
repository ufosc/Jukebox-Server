import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'
import { QueueDto } from './dto/queue.dto'
import { QueuedTrack } from './entities/queued-track.entity'
import { CreateQueuedTrackDto, QueuedTrackDto } from './dto'
import { JukeSessionService } from '../juke-session/juke-session.service'
import { JukeSessionDto } from '../juke-session/dto/juke-session.dto'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AccountLinkService } from '../account-link/account-link.service'

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueuedTrack) private queuedTrackRepo: Repository<QueuedTrack>,
    private jukeSessionService: JukeSessionService,
    private accountLinkService: AccountLinkService,
    private spotifyService: SpotifyService
  ) { }

  /**
   * This is for testing please stay away from this when creating queued tracks.
   *
   * queueTrack
   * @param payload
   * @returns Creates a queued track for testing
   */
  async createQueuedTrack(jukeSessionId: number, payload: CreateQueuedTrackDto): Promise<QueuedTrackDto> {
    const preTrack = this.queuedTrackRepo.create({ ...payload, order: -1, juke_session: { id: jukeSessionId } })
    const track = this.queuedTrackRepo.save(preTrack)
    return plainToInstance(QueuedTrackDto, track)
  }

  /**
   * Get a queued track by id, or throw 404 error.
   */
  async getQueuedTrackById(id: number): Promise<QueuedTrackDto> {
    const query = await this.queuedTrackRepo.findOne({
      where: { id },
      relations: {
        juke_session: true,
        queued_by: true,
        track: true,
        interactions: true,
      }
    })

    if (!query) {
      throw new NotFoundException(`Cannot find queued track with id ${id}`)
    }

    return plainToInstance(QueuedTrackDto, query)
  }

  /**
   * Add track to a juke session's queue.
   */
  async queueTrack(jukeSessionId: number, createQueuedTrackDto: CreateQueuedTrackDto): Promise<QueuedTrackDto> {
    await this.checkSession(jukeSessionId)
    const queue = await this.queuedTrackRepo.find({ where: { juke_session: { id: jukeSessionId }, played: false } })
    const preQueuedTrack = this.queuedTrackRepo.create({ ...createQueuedTrackDto, juke_session: { id: jukeSessionId }, order: queue.length + 1 })
    const queuedTrack = await this.queuedTrackRepo.save(preQueuedTrack)
    return plainToInstance(QueuedTrackDto, await this.getQueuedTrackById(queuedTrack.id))
  }

  /**
   * Get tracks queue for a juke session.
   */
  async getQueue(jukeSessionId: number): Promise<QueueDto> {
    const queue = await this.queuedTrackRepo.find({
      where: { juke_session: { id: jukeSessionId }, played: false },
      relations: {
        juke_session: true,
        queued_by: true,
        track: true,
        interactions: true,
      },
      order: {
        is_editable: 'ASC',
        order: 'ASC',
      },
    })
    const session = await this.checkSession(jukeSessionId)
    return { juke_session: session, tracks: plainToInstance(QueuedTrackDto, queue) }
  }

  /**
   * Re-order the tracks in a queue.
   */
  async setQueueOrder(jukeSessionId: number, ordering: number[]): Promise<QueueDto> {
    await this.queuedTrackRepo.query(
      `
      UPDATE queued_track AS qt
      SET "order" = ordering.ord
      FROM unnest($1::int[]) WITH ORDINALITY AS ordering(id, ord)
      WHERE qt.id = ordering.id
      AND qt.is_editable = true
      `,
      [ordering],
    );

    return await this.getQueue(jukeSessionId)
  }

  /**
   * Remove a track from the queue.
   */
  async removeTrackFromQueue(jukeSessionId: number, queuedTrackId: number) {
    const result = await this.queuedTrackRepo.update({ id: queuedTrackId, is_editable: true, played: false }, { is_editable: false, played: true })
    if (result.affected === 0) {
      throw new BadRequestException(
        "Id does not exist for queued track or queued track cannot be edited because it is queued in spotify"
      )
    }
  }

  /**
   * Get the next track, remove it from the queue.
   */
  async popNextTrack(jukeSessionId: number): Promise<QueuedTrackDto> {
    const queuedTrack = await this.queuedTrackRepo.findOne({
      where: { juke_session: { id: jukeSessionId }, played: false },
      relations: {
        juke_session: true,
        queued_by: true,
        track: true,
        interactions: true,
      },
      order: {
        is_editable: 'ASC',
        order: 'ASC',
      },
    })

    if (!queuedTrack) {
      throw new NotFoundException("The queue is empty, could not pop next track")
    }

    await this.queuedTrackRepo.update({ id: queuedTrack.id, is_editable: true, played: false }, { is_editable: false, played: true })

    return plainToInstance(QueuedTrackDto, queuedTrack)
  }

  /**
   * Get the next track, keep it in the queue.
   */
  async getNextTrack(jukeSessionId: number): Promise<QueuedTrackDto> {
    const queuedTrack = await this.queuedTrackRepo.findOne({
      where: { juke_session: { id: jukeSessionId }, played: false },
      relations: {
        juke_session: true,
        queued_by: true,
        track: true,
        interactions: true,
      },
      order: {
        is_editable: 'ASC',
        order: 'ASC',
      },
    })

    if (!queuedTrack) {
      throw new NotFoundException("The queue is empty, could not get next track")
    }

    return plainToInstance(QueuedTrackDto, queuedTrack)
  }

  /**
   * Remove all tracks from queue.
   */
  async clearQueue(jukeSessionId: number) {
    await this.checkSession(jukeSessionId)
    await this.queuedTrackRepo.delete({ juke_session: { id: jukeSessionId }, played: false })
  }

  /**
   * Add the next track in our queue to spotify's queue.
   * Sets the queued track as non editable.
   */
  async queueNextTrackToSpotify(jukeboxId: number, jukeSessionId: number) {
    const accountLink = await this.accountLinkService.getActiveAccount(jukeboxId)
    const queuedTrack = await this.getNextTrack(jukeSessionId)
    await this.spotifyService.queueTrack(accountLink.spotify_account, queuedTrack.track.spotify_uri)
    await this.queuedTrackRepo.update({ id: queuedTrack.id }, { is_editable: false })
  }

  /**
   * Play a track by id, setting queued track played, is_editable, and played_at
   */
  async playQueuedTrack(queuedTrackId: number) {
    await this.queuedTrackRepo.update({ id: queuedTrackId }, { played: true, is_editable: false, played_at: new Date() })
  }

  /**
   * Checks if a session exists before proceeding, otherwise throws
   * @param jukeSessionId Juke Session Id
   * @throws NotFoundException
   * @returns
   */
  private async checkSession(jukeSessionId: number): Promise<JukeSessionDto> {
    try {
      return await this.jukeSessionService.findOne(jukeSessionId)
    } catch (NotFoundException) {
      throw new NotFoundException("Could not get queue for juke session that does not exist")
    }
  }
}
