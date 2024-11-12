export class TrackStateUpdateDto implements ITrackStateUpdate {
  current_track?: ITrack
  next_tracks?: ITrack[]
  jukebox_id: number
}

export class PlayerUpdateDto implements IPlayerUpdate {
  
  current_track?: ITrack
  jukebox_id: number
}
