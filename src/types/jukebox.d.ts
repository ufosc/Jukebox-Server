// declare interface IJukebox extends IModel {
//   name: string
//   club_id: number
//   links: IJukeboxLink[]
// }

// declare type JukeboxLinkType = 'spotify'

// declare interface IJukeboxLink extends IModel {
//   type: JukeboxLinkType
//   email: string
//   active: boolean
// }

// declare interface ISpotifyAccount {
//   id: number
//   access_token: string
//   refresh_token: string
//   user_id: number
//   spotify_email: string
//   expires_in: number
//   expires_at: Date
//   token_type: string
// }

// declare interface IJukeboxLinkAccount extends IJukeboxLink {
//   account: ISpotifyAccount
// }

// declare interface IPlayerState {
//   jukebox_id: number
//   current_track?: ITrackMeta
//   progress: number
//   is_playing: boolean
// }

// /**
//  * State of the current player stored in Redis
//  */
// declare interface IPlayerMetaState extends IPlayerState {
//   /** Next up in Spotify's queue */
//   default_next_tracks: ITrack[]
// }

// /**
//  * The state of the player broadcast to socket subscribers
//  */
// declare interface IPlayerQueueState extends IPlayerState {
//   next_tracks: ITrack[]
// }

// declare interface IPlayerAuxUpdate extends IPlayerMetaState {
//   changed_tracks?: boolean
// }
// declare interface IPlayerUpdate extends IPlayerQueueState {}

// declare interface IPlayerAction extends Partial<IPlayerState> {
//   current_track?: Partial<ITrackMeta>
// }
