import type { Track } from '@spotify/web-api-ts-sdk'
import { NotImplementedError } from 'server/utils'

export class TrackQueueItem {
  constructor(public track: Track) {}
}

export class TrackQueue {
  protected tracks: TrackQueueItem[] = [];

  constructor(readonly groupId: string) {}

  // Pushes a track to the end of the queue and returns the new length
  public push(track: Track): number {
    this.tracks.push(new TrackQueueItem(track));
    return this.tracks.length;
  }

  // Pops a track from the front of the queue
  public pop(): Track | undefined {
    const item = this.tracks.shift(); // Remove the first item
    return item ? item.track : undefined; // Return the track or undefined if the queue was empty
  }

  // Peeks at the track at the front of the queue without removing it
  public peek(): Track | undefined {
    const item = this.tracks[0]; // Get the first item
    return item ? item.track : undefined; // Return the track or undefined if the queue is empty
  }

  // Moves a track to a new position in the queue
  public setPosition(track: Track, pos: number) {
    const currentIndex = this.tracks.findIndex(item => item.track === track);
    if (currentIndex === -1) {
      throw new Error('Track not found');
    }

    // Remove the track from its current position
    const [removedTrack] = this.tracks.splice(currentIndex, 1);

    // Ensure the new position is within bounds
    pos = Math.max(0, Math.min(pos, this.tracks.length));

    // Insert the track at the new position
    this.tracks.splice(pos, 0, removedTrack);
  }
}