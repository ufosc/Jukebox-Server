import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import type { Track } from '@spotify/web-api-ts-sdk'
import { Cache } from 'cache-manager'
import { PlayerMetaStateDto } from '../dto/player-state.dto'

export class TrackQueueItem {
  recommended_by: string
  constructor(public track: Track) {}
}

export class TrackQueue {
  constructor(readonly tracks: TrackQueueItem[]) {}

  // Pushes a track to the end of the queue and returns the new length
  public push(track: Track): number {
    this.tracks.push(new TrackQueueItem(track))
    return this.tracks.length
  }

  // Pops a track from the front of the queue
  public pop(): Track | undefined {
    if (this.tracks.length === 0) return undefined
    const item = this.tracks.shift() // Remove the first item
    return item ? item.track : undefined // Return the track or undefined if the queue was empty
  }

  // Peeks at the track at the front of the queue without removing it
  public peek(offset = 0): Track | undefined {
    const item = this.tracks[offset]
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
  private cacheTtlSec = 600
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private getCacheKey(jukeboxId: number, label: 'queue' | 'currently-playing') {
    return `${label}-${jukeboxId}`
  }

  private async getQueue(jukeboxId: number) {
    const key = this.getCacheKey(jukeboxId, 'queue')
    const tracks = (await this.cache.get<TrackQueueItem[] | undefined>(key)) ?? []
    return new TrackQueue(tracks)
  }

  private async commitQueue(jukeboxId: number, queue: TrackQueue) {
    const key = this.getCacheKey(jukeboxId, 'queue')
    await this.cache.set(key, queue.tracks, this.cacheTtlSec)
  }

  private async getCurrentlyPlaying(jukeboxId: number): Promise<PlayerMetaStateDto | null> {
    const key = this.getCacheKey(jukeboxId, 'currently-playing')
    const playing = await this.cache.get<PlayerMetaStateDto | undefined>(key)

    return playing ?? null
  }

  private async setCurrentlyPlaying(jukeboxId: number, playerState: PlayerMetaStateDto) {
    const key = this.getCacheKey(jukeboxId, 'currently-playing')
    await this.cache.set(key, playerState, this.cacheTtlSec)
  }

  /**
   * Get next tracks in queue, excludes current track
   */
  public async getTrackQueue(jukeboxId: number) {
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

    this.commitQueue(jukeboxId, queue)
    return track
  }

  public async peekNextTrack(jukeboxId: number): Promise<Track | null> {
    const queue = await this.getQueue(jukeboxId)
    return queue.peek()
  }

  public async queueIsEmpty(jukeboxId: number): Promise<boolean> {
    const queue = await this.getQueue(jukeboxId)
    return queue.list().length === 0
  }

  public async getPlayerState(jukeboxId: number): Promise<PlayerMetaStateDto | null> {
    return await this.getCurrentlyPlaying(jukeboxId)
  }

  public async setPlayerState(jukeboxId: number, playerState: PlayerMetaStateDto | null) {
    return await this.setCurrentlyPlaying(jukeboxId, playerState)
  }

  /**
   * Get track queue.
   * If empty, returns default next tracks defined
   * in the current player state, which represents what's
   * automatically next up in Spotify's queue.
   */
  public async getTrackQueueOrDefaults(jukeboxId: number) {
    let queued = await this.getTrackQueue(jukeboxId)
    if (queued && queued.length === 0) {
      const playerState = await this.getPlayerState(jukeboxId)
      queued = playerState.default_next_tracks
    }

    return queued || []
  }
}
