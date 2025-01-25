declare interface ISpotifyAccount extends IModel {
  access_token: string
  user_id: number
  spotify_email: string
  expires_in: number
  expires_at: Date
  token_type: string
}
