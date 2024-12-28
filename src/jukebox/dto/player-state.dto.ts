export class PlayerStateDto implements IPlayerState {
  jukebox_id: number
  current_track?: ITrack
  position: number
  is_playing: boolean
  next_tracks: ITrack[]
}

export class PlayerMetaStateDto implements IPlayerMetaState {
  jukebox_id: number
  current_track?: ITrack
  position: number
  is_playing: boolean
  default_next_tracks: ITrack[]
}
