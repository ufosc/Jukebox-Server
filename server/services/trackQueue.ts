import type { Track } from '@spotify/web-api-ts-sdk'
import { NotImplementedError } from 'server/utils'

export class TrackQueueItem {
  constructor(public track: Track) {}
}

export class TrackQueue {
  protected tracks: TrackQueueItem[] = []

  constructor(readonly groupId: string) {}

  public push(track: Track): number {
    this.tracks.push(new TrackQueueItem(track));
    return 0;
    // throw new NotImplementedError('TrackQueue.push')
  }
  public pop(): Track {
    this.tracks.pop();
    throw new NotImplementedError('TrackQueue.pop')
  }
  public peek(): Track {
    return this.tracks[-1].track;
    throw new NotImplementedError('TrackQueue.peek')
  }
  public setPosition(track: Track, pos: number) {}
  
}

// export interface Track extends SimplifiedTrack {
//   album: SimplifiedAlbum;
//   external_ids: ExternalIds;
//   popularity: number;
// }