export class PlayerStateDto implements IPlayerState {
  jukebox_id: number
  current_track?: ITrack
  progress: number
  is_playing: boolean
}
export class PlayerQueueStateDto extends PlayerStateDto implements IPlayerQueueState {
  next_tracks: ITrack[]
}

export class PlayerMetaStateDto extends PlayerStateDto implements IPlayerMetaState {
  default_next_tracks: ITrack[]
}
