import type { QueuedTrackDto } from './track.dto'

export class PlayerStateDto implements IPlayerState {
  jukebox_id: number
  current_track?: QueuedTrackDto
  progress: number
  is_playing: boolean
}

// export class PlayerMetaStateDto extends PlayerStateDto implements IPlayerMetaState {
//   default_next_tracks: ITrack[]
// }

export class PlayerStateUpdateDto implements IPlayerUpdate {
  jukebox_id: number
  current_track?: Partial<QueuedTrackDto>
  progress?: number
  is_playing?: boolean
}
