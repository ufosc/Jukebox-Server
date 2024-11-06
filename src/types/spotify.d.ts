declare type ITrack = Spotify.Track

declare interface ITrackStateUpdate {
  current_track?: ITrack
  // is_playing: boolean
  next_tracks?: ITrack[]
  jukebox_id: number
}

declare interface IPlayerUpdate {
  current_track?: ITrack
  jukebox_id: number
}
