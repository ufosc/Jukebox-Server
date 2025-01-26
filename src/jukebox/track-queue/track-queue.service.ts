import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { randomUUID } from 'crypto'
import { PlayerStateDto } from '../dto/player-state.dto'

export class QueueItem<T = unknown> {
  recommended_by: string
  constructor(public item: T) {}
}

export class Queue<T = unknown> {
  constructor(readonly items: QueueItem<T>[]) {}

  // Pushes a track to the end of the queue and returns the new length
  public push(track: T): number {
    this.items.push(new QueueItem(track))
    return this.items.length
  }

  // Pops a track from the front of the queue
  public pop(): T | undefined {
    if (this.items.length === 0) return undefined
    const target = this.items.shift() // Remove the first item
    return target ? target.item : undefined // Return the track or undefined if the queue was empty
  }

  // Peeks at the track at the front of the queue without removing it
  public peek(offset = 0): T | undefined {
    const target = this.items[offset]
    return target ? target.item : undefined // Return the track or undefined if the queue is empty
  }

  public list(): T[] {
    return this.items.map((item) => item.item)
  }

  // Moves a track to a new position in the queue
  public setPosition(track: T, pos: number) {
    const currentIndex = this.items.findIndex((target) => target.item === track)
    if (currentIndex === -1) {
      throw new Error('Track not found')
    }

    // Remove the track from its current position
    const [removedTrack] = this.items.splice(currentIndex, 1)

    // Ensure the new position is within bounds
    pos = Math.max(0, Math.min(pos, this.items.length))

    // Insert the track at the new position
    this.items.splice(pos, 0, removedTrack)
  }

  public update(pos: number, fields: Partial<T>) {
    if (this.items.length <= pos) return
    this.items[pos] = { ...this.items[pos], ...fields }

    return this.items[pos]
  }
}
type TrackQueue = Queue<IQueuedTrack>
type TrackQueueItem = QueueItem<IQueuedTrack>

@Injectable()
export class TrackQueueService {
  private cacheTtlSec = 600

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private getCacheKey(jukeboxId: number, label: 'queue' | 'currently-playing') {
    return `${label}-${jukeboxId}`
  }

  private async getCachedQueue(jukeboxId: number) {
    const key = this.getCacheKey(jukeboxId, 'queue')
    const tracks = (await this.cache.get<TrackQueueItem[] | undefined>(key)) ?? []
    return new Queue(tracks)
  }

  private async commitQueue(jukeboxId: number, queue: TrackQueue) {
    const key = this.getCacheKey(jukeboxId, 'queue')
    await this.cache.set(key, queue.items, this.cacheTtlSec)
  }

  private async getCachedPlayerState(jukeboxId: number): Promise<PlayerStateDto | null> {
    const key = this.getCacheKey(jukeboxId, 'currently-playing')
    const playing = await this.cache.get<PlayerStateDto | undefined>(key)

    return playing ?? null
  }

  private async commitPlayerState(jukeboxId: number, playerState: PlayerStateDto) {
    const key = this.getCacheKey(jukeboxId, 'currently-playing')
    await this.cache.set(key, playerState, this.cacheTtlSec)
  }

  /**
   * Get next tracks in queue, excludes current track
   */
  public async getTrackQueue(jukeboxId: number) {
    const queue = await this.getCachedQueue(jukeboxId)
    return queue.list()
  }

  public async queueTrack(
    jukeboxId: number,
    track: ITrackDetails,
    recommended_by?: string,
    position = -1,
  ) {
    const queue = await this.getCachedQueue(jukeboxId)
    const updatedTrack: IQueuedTrack = {
      track,
      queue_id: randomUUID(),
      recommended_by,
      spotify_queued: false,
      interactions: { likes: 0, dislikes: 0 },
    }

    queue.push(updatedTrack)
    if (position >= 0) {
      queue.setPosition(updatedTrack, position)
    }

    await this.commitQueue(jukeboxId, queue)
    return track
  }

  public async popTrack(jukeboxId: number): Promise<IQueuedTrack | null> {
    const queue = await this.getCachedQueue(jukeboxId)
    const track: IQueuedTrack | null = queue.pop() ?? null

    this.commitQueue(jukeboxId, queue)
    return track
  }

  public async peekNextTrack(jukeboxId: number): Promise<IQueuedTrack | null> {
    const queue = await this.getCachedQueue(jukeboxId)
    return queue.peek()
  }

  public async queueIsEmpty(jukeboxId: number): Promise<boolean> {
    const queue = await this.getCachedQueue(jukeboxId)
    return queue.list().length === 0
  }

  public async getPlayerState(jukeboxId: number): Promise<PlayerStateDto | null> {
    return await this.getCachedPlayerState(jukeboxId)
  }

  public async setPlayerState(jukeboxId: number, playerState: PlayerStateDto | null) {
    return await this.commitPlayerState(jukeboxId, playerState)
  }

  // /**
  //  * Get track queue.
  //  * If empty, returns default next tracks defined
  //  * in the current player state, which represents what's
  //  * automatically next up in Spotify's queue.
  //  */
  // public async getTrackQueueOrDefaults(jukeboxId: number) {
  //   let queued: IQueuedTrack[] = await this.getTrackQueue(jukeboxId)
  //   if (queued && queued.length === 0) {
  //     const playerState = await this.getPlayerState(jukeboxId)

  //     queued = playerState?.default_next_tracks.map((track) => ({
  //       ...track,
  //       queue_id: randomUUID(),
  //     }))
  //   }

  //   return queued || []
  // }

  public async flagNextTrackAsQueued(jukeboxId: number) {
    const nextTrack = await this.peekNextTrack(jukeboxId)
    if (!nextTrack) return

    const queue = await this.getCachedQueue(jukeboxId)
    queue.update(0, { spotify_queued: true })
    await this.commitQueue(jukeboxId, queue)
  }

  public async clearQueue(jukeboxId: number) {
    const queue = new Queue<IQueuedTrack>([])
    await this.commitQueue(jukeboxId, queue)
  }

  public async updatePlayerState(jukeboxId: number, cb: (state: PlayerStateDto) => PlayerStateDto) {
    const playerState = await this.getPlayerState(jukeboxId)
    const updatedState = cb(playerState)
    await this.commitPlayerState(jukeboxId, updatedState)

    return updatedState
  }
}
