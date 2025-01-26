/**
 * Manages player and track queue information for a club.
 */
declare interface IJukebox extends IModel {
  name: string
  club_id: number
  links: IJukeboxLink[]
}

/**
 * The type of music app that is linked to the jukebox.
 *
 * In the future, we may support apps like Apple Music, Amazon Music, etc.
 */
declare type JukeboxLinkType = 'spotify'

/**
 * Represents a connection between a jukebox and a music app.
 *
 * This is used to get the appropriate credentials for the player
 * on the frontend. It would be a security risk to return the credentials
 * for all of the links with the jukebox information.
 */
declare interface IJukeboxLink extends IModel {
  type: JukeboxLinkType
  email: string
  active: boolean
}

/**
 * Spotify credentials needed to authenticate with the Spotify API
 * and the Spotify Web Player.
 */
declare interface ISpotifyAccount {
  id: number
  access_token: string
  refresh_token: string
  user_id: number
  spotify_email: string
  expires_in: number
  expires_at: Date
  token_type: string
}

/**
 * Information about a track that is currently playing, if applicable.
 */
declare interface IPlayerState {
  jukebox_id: number
  current_track?: IQueuedTrack
  progress: number
  is_playing: boolean
}

/**
 * Information passed to socket subscribers when the player state changes.
 */
declare interface IPlayerUpdate extends Partial<IPlayerState> {
  current_track?: Partial<ITrackMeta>
}

/**
 * The state of the player broadcast to socket subscribers
 */
declare interface IPlayerQueueState extends IPlayerState {
  next_tracks: ITrack[]
}

/**
 * Updates sent to the server from the player.
 */
declare interface IPlayerAuxUpdate extends IPlayerState {
  changed_tracks?: boolean
}
