import { Injectable } from '@nestjs/common'
import type { Track } from '@spotify/web-api-ts-sdk'

export class TrackQueueItem {
  constructor(public track: Track) {}
}

export class TrackQueue {
  private static queues: { [jukeboxId: number]: TrackQueue } = {}
  protected tracks: TrackQueueItem[] = []

  private constructor(readonly jukeboxId: number) {}

  public static getQueue(jukeboxId: number) {
    if (!(jukeboxId in this.queues)) {
      console.log('Creating new track queue...')
      this.queues[jukeboxId] = new TrackQueue(jukeboxId)
    }

    return this.queues[jukeboxId]
  }

  // Pushes a track to the end of the queue and returns the new length
  public push(track: Track): number {
    this.tracks.push(new TrackQueueItem(track))
    return this.tracks.length
  }

  // Pops a track from the front of the queue
  public pop(): Track | undefined {
    const item = this.tracks.shift() // Remove the first item
    return item ? item.track : undefined // Return the track or undefined if the queue was empty
  }

  // Peeks at the track at the front of the queue without removing it
  public peek(): Track | undefined {
    const item = this.tracks[0] // Get the first item
    return item ? item.track : undefined // Return the track or undefined if the queue is empty
  }

  public list(): Track[] {
    return this.tracks.map((item) => item.track)
  }

  // Moves a track to a new position in the queue
  public setPosition(track: Track, pos: number) {
    const currentIndex = this.tracks.findIndex((item) => item.track === track)
    if (currentIndex === -1) {
      throw new Error('Track not found')
    }

    // Remove the track from its current position
    const [removedTrack] = this.tracks.splice(currentIndex, 1)

    // Ensure the new position is within bounds
    pos = Math.max(0, Math.min(pos, this.tracks.length))

    // Insert the track at the new position
    this.tracks.splice(pos, 0, removedTrack)
  }
}

@Injectable()
export class TrackQueueService {
  constructor() {}

  private getQueue(jukeboxId) {
    return TrackQueue.getQueue(jukeboxId)
  }

  public listTracks(jukeboxId: number) {
    const queue = this.getQueue(jukeboxId)
    return queue.list()
  }

  public queueTrack(jukeboxId: number, track: Track, position = -1) {
    const queue = this.getQueue(jukeboxId)

    queue.push(track)
    if (position >= 0) {
      queue.setPosition(track, position)
    }
  }
}
