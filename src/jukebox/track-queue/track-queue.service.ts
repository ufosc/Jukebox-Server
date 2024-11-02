import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import type { Track } from '@spotify/web-api-ts-sdk'
import { Cache } from 'cache-manager'

export class TrackQueueItem {
  recommended_by: string
  constructor(public track: Track) {}
}

export class TrackQueue {
  // private static queues: { [jukeboxId: number]: TrackQueue } = {}
  // protected tracks: TrackQueueItem[] = []

  // private constructor(readonly jukeboxId: number) {}
  constructor(readonly tracks: TrackQueueItem[]) {}

  // public static getQueue(jukeboxId: number) {
  //   if (!(jukeboxId in this.queues)) {
  //     console.log('Creating new track queue...')
  //     this.queues[jukeboxId] = new TrackQueue(jukeboxId)
  //   }

  //   return this.queues[jukeboxId]
  // }

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
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private getCacheKey(jukeboxId: number) {
    return `queue-${jukeboxId}`
  }

  private async getQueue(jukeboxId: number) {
    const key = this.getCacheKey(jukeboxId)
    const tracks = (await this.cache.get<TrackQueueItem[] | undefined>(key)) ?? []
    return new TrackQueue(tracks)
    // return TrackQueue.getQueue(jukeboxId)
  }

  private async commitQueue(jukeboxId: number, queue: TrackQueue) {
    const key = this.getCacheKey(jukeboxId)
    await this.cache.set(key, queue.tracks)
  }

  public async listTracks(jukeboxId: number) {
    const queue = await this.getQueue(jukeboxId)
    return queue.list()
  }

  public async queueTrack(jukeboxId: number, track: Track, position = -1) {
    const queue = await this.getQueue(jukeboxId)

    queue.push(track)
    if (position >= 0) {
      queue.setPosition(track, position)
    }

    await this.commitQueue(jukeboxId, queue)
    return track
  }

  public async popTrack(jukeboxId: number): Promise<Track | null> {
    const queue = await this.getQueue(jukeboxId)
    const track: Track | null = queue.pop() ?? null
    console.log('New queue:', queue.list())

    this.commitQueue(jukeboxId, queue)
    return track
  }

  public async peekTrack(jukeboxId: number): Promise<Track | null> {
    const queue = await this.getQueue(jukeboxId)
    const track: Track | null = queue.peek() ?? null

    return track
  }
}
