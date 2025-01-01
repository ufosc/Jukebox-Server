declare interface ITrack extends Spotify.Track {}

declare interface ITrackMeta extends ITrack {
  queue_id: string
  recommended_by?: string
  spotify_queued?: boolean
}
