export class PlayerQueueStateDto implements IPlayerQueueState {
  jukebox_id: number
  current_track?: ITrack
  progress: number
  is_playing: boolean
  next_tracks: ITrack[]
}

export class PlayerMetaStateDto implements IPlayerMetaState {
  jukebox_id: number
  current_track?: ITrack
  progress: number
  is_playing: boolean
  default_next_tracks: ITrack[]
}
