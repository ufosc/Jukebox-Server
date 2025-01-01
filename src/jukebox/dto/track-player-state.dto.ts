export class PlayerUpdateDto implements IPlayerUpdate {
  jukebox_id: number
  current_track?: ITrack
  progress: number
  is_playing: boolean
  next_tracks: ITrack[]
}

export class PlayerAuxUpdateDto implements IPlayerAuxUpdate {
  jukebox_id: number
  current_track: ITrack
  progress: number
  is_playing: boolean
  default_next_tracks: ITrack[]
  changed_tracks?: boolean;
}
