import { Injectable, NotImplementedException } from '@nestjs/common'
import { TrackDto } from 'src/track/dto/track.dto'
import { QueueDto } from './dto/queue.dto'
import { QueuedTrackDto } from './dto/queued-track.dto'

@Injectable()
export class QueueService {
  /**
   * Add track to a juke session's queue.
   */
  queueTrack(jukeSessionId: number, track: TrackDto): QueuedTrackDto {
    throw new NotImplementedException()
  }

  /**
   * Get tracks queue for a juke session.
   */
  getQueue(jukeSessionId: number): QueueDto {
    throw new NotImplementedException()
  }

  /**
   * Re-order the tracks in a queue.
   */
  setQueueOrder(jukeSessionId: number, ordering: number[]): QueueDto {
    throw new NotImplementedException()
  }

  /**
   * Remove a track from the queue.
   */
  removeTrackFromQueue(jukeSessionid: number, queuedTrackId: number): QueuedTrackDto {
    throw new NotImplementedException()
  }

  /**
   * Get the next track, remove it from the queue.
   */
  popNextTrack(jukeSessionId: number): QueuedTrackDto {
    throw new NotImplementedException()
  }

  /**
   * Remove all tracks from queue.
   */
  clearQueue(jukeSessionId: number) {
    throw new NotImplementedException()
  }
}
