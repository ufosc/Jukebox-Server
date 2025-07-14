import { Injectable, NotImplementedException } from '@nestjs/common'
import { TrackDto } from 'src/track/dto/track.dto'
import { QueueDto } from './dto/queue.dto'
import { QueuedTrackDto } from './dto/queued-track.dto'

export interface IQueueService {
  getNextTrack(jukeboxId: number): Promise<QueuedTrackDto>
}

@Injectable()
export class QueueService implements IQueueService {
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
