import type { Group } from 'src/models'
import type { CurrentTrack } from './tracks/trackPlayer'
import type { TrackQueue } from './tracks/trackQueue'

interface IJamSession {
  group: Group
  trackQueue: TrackQueue
  currentlyPlaying: CurrentTrack
  duration: number
  startTime: Date
  endTime: Date
  active: boolean
  start: () => void
  end: () => void
  duplicate: () => void
  queueTrack: () => void
  removeTrack: () => void
  likeTrack: () => void
  dislikeTrack: () => void
}

export class JamSession implements IJamSession {
  group: Group
  duration: number // minutes
  startTime: Date
  endTime: Date
  trackQueue: TrackQueue
  currentlyPlaying: CurrentTrack
  active: boolean
  private constructor(group: Group, duration: number) {
    this.group = group
    this.startTime = new Date()
    this.duration = duration
    this.endTime = new Date(Date.now() + duration * 1000 * 60)

    // FIXME
    this.trackQueue = {} as TrackQueue
    this.currentlyPlaying = {} as CurrentTrack
    this.active = {} as boolean
  }
  public static create = async (config: {
    group: Group
    duration: number
  }): Promise<JamSession> => {
    const { group, duration } = config
    console.log(`Creating jam session: ${group.name} - ${duration} minutes`)
    throw new Error('Not implemented')
  }

  public start = async () => {
    throw new Error('Not implemented')
  }
  public end = async () => {
    throw new Error('Not implemented')
  }
  public duplicate = async () => {
    throw new Error('Not implemented')
  }
  public queueTrack = () => {
    throw new Error('Not implemented')
  }
  public removeTrack = () => {
    throw new Error('Not implemented')
  }
  public likeTrack = () => {
    throw new Error('Not implemented')
  }
  public dislikeTrack = () => {
    throw new Error('Not implemented')
  }
}
