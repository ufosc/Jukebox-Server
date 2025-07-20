import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TrackDto } from 'src/track/dto/track.dto'
import { Repository } from 'typeorm'
import { QueueDto } from './dto/queue.dto'
import { CreateQueuedTrackDto, QueuedTrackDto } from './dto/queued-track.dto'
import { QueuedTrack } from './entities/queued-track.entity'

@Injectable()
export class QueueService {
  constructor(@InjectRepository(QueuedTrack) private queuedTrackRepo: Repository<QueuedTrack>) {}

  createQueuedTrack(payload: CreateQueuedTrackDto): QueuedTrack {
    return this.queuedTrackRepo.create(payload)
  }

  /**
   * Get a queued track by id, or throw 404 error.
   */
  async getQueuedTrackById(id: number): Promise<QueuedTrack> {
    const query = await this.queuedTrackRepo.findOne({
      where: { id },
      relations: { interactions: true },
    })

    if (!query) {
      throw new NotFoundException(`Cannot find queued track with id ${id}`)
    }

    return query
  }

  /**
   * Add track to a juke session's queue.
   */
  async queueTrack(jukeboxId: number, track: TrackDto): Promise<QueuedTrackDto> {
    throw new NotImplementedException()
  }

  /**
   * Get tracks queue for a juke session.
   */
  async getQueue(jukeboxId: number): Promise<QueueDto> {
    throw new NotImplementedException()
  }

  /**
   * Re-order the tracks in a queue.
   */
  async setQueueOrder(jukeboxId: number, ordering: number[]): Promise<QueueDto> {
    throw new NotImplementedException()
  }

  /**
   * Remove a track from the queue.
   */
  async removeTrackFromQueue(jukeboxId: number, queuedTrackId: number): Promise<QueuedTrackDto> {
    throw new NotImplementedException()
  }

  /**
   * Get the next track, remove it from the queue.
   */
  async popNextTrack(jukeboxId: number): Promise<QueuedTrackDto> {
    throw new NotImplementedException()
  }

  /**
   * Get the next track, keep it in the queue.
   */
  async getNextTrack(jukeboxId: number): Promise<QueuedTrackDto> {
    throw new NotImplementedException()
  }

  /**
   * Remove all tracks from queue.
   */
  async clearQueue(jukeboxId: number) {
    throw new NotImplementedException()
  }

  /**
   * Add the next track in our queue to spotify's queue.
   * Sets the queued track as non editable.
   */
  async queueNextTrackToSpotify(jukeboxId: number) {}
}
