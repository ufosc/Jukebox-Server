import type { Track } from '@spotify/web-api-ts-sdk'
import { NotImplementedError } from 'server/utils'

export class TrackQueueItem {
  constructor(public track: Track) {}
}

export class TrackQueue {
  protected tracks: TrackQueueItem[] = []

  constructor(readonly groupId: string) {}

  public push(track: Track): number {
    throw new NotImplementedError('TrackQueue.push')
  }
  public pop(): Track {
    throw new NotImplementedError('TrackQueue.pop')
  }
  public peek(): Track {
    throw new NotImplementedError('TrackQueue.peek')
  }
  public setPosition(track: Track, pos: number) {}
}
