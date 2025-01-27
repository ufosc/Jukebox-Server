/**
 * Manages player and track queue information for a club.
 */
declare interface IJukebox extends IModel {
  name: string
  club_id: number
  links: IJukeboxLink[]
}

/**
 * Fields required to create a new jukebox.
 *
 * @see {@link IJukebox}
 */
declare interface IJukeboxCreate extends ICreate<IJukebox> {
  name: string
  club_id: number
}

/**
 * Fields used for updating a jukebox.
 *
 * @see {@link IJukebox}
 */
declare interface IJukeboxUpdate extends IUpdate<IJukebox> {
  name: string
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
 * Fields required to create a new jukebox link.
 *
 * @see {@link IJukeboxLink}
 */
declare interface IJukeboxLinkCreate extends ICreate<IJukeboxLink> {
  type: JukeboxLinkType
  email: string
  active: boolean
}

/**
 * Fields used for updating a jukebox link.
 *
 * @see {@link IJukeboxLink}
 */
declare interface IJukeboxLinkUpdate extends IUpdate<IJukeboxLink> {
  active: boolean
  email: never
  type: never
}

/**
 * Spotify credentials needed to authenticate with the Spotify API
 * and the Spotify Web Player.
 */
declare interface ISpotifyAccount extends IModel {
  access_token: string
  refresh_token: string
  user_id: number
  spotify_email: string
  expires_in: number
  expires_at: string
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
 * Contains minimal information when needed to send frequently.
 *
 * @see {@link IPlayerState}
 */
declare interface IPlayerUpdate extends Partial<IPlayerState> {
  jukebox_id: number
  current_track?: Partial<IQueuedTrack>
}

/**
 * Full state of the player, including the track queue.
 * Used if needed to reduce the number of requests.
 *
 * @see {@link IPlayerState}
 */
declare interface IPlayerQueueState extends IPlayerState {
  next_tracks: IQueuedTrack[]
}

/**
 * Represents the state of the spotify web player.
 *
 * @see {@link IPlayerState}
 */
declare interface IPlayerAuxState extends IPlayerState {
  current_track?: IPlayerTrack | null
}

/**
 * Updates sent to the server from the player.
 * Contains additional information to tell the server
 * what actions it should take upon update, if any.
 *
 * @see {@link IPlayerState}
 */
declare interface IPlayerAuxUpdate extends IPlayerAuxState {
  changed_tracks?: boolean
}

/**
 * Fields needed for a user to interact with a jukebox.
 *
 * @see {@link IJukeboxInteraction}
 */
declare interface IJukeboxInteractionCreate {
  action: 'like' | 'dislike'
  location: 'player' | 'queue'
  queue_index?: number
}

/**
 * Fields used to represent a user interaction with a
 * track in the jukebox - whether in the queue or
 * in the current player.
 */

declare interface IJukeboxInteraction extends IJukeboxInteractionCreate {
  jukebox_id: number
  user: IUser
}
