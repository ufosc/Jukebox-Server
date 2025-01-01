import { TrackMetaDto } from './track.dto'

export class PlayerStateDto implements IPlayerState {
  jukebox_id: number
  current_track?: TrackMetaDto
  progress: number
  is_playing: boolean
}
export class PlayerQueueStateDto extends PlayerStateDto implements IPlayerQueueState {
  next_tracks: ITrack[]
}

export class PlayerMetaStateDto extends PlayerStateDto implements IPlayerMetaState {
  default_next_tracks: ITrack[]
}

export class PlayerStateActionDto implements IPlayerAction {
  jukebox_id: number
  current_track?: Partial<TrackMetaDto>
  progress?: number
  is_playing?: boolean
}
