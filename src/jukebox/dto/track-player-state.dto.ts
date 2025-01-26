export class PlayerAuxUpdateDto implements IPlayerAuxUpdate {
  jukebox_id: number
  current_track: IQueuedTrack
  progress: number
  is_playing: boolean
  default_next_tracks: ITrack[]
  changed_tracks?: boolean
}
