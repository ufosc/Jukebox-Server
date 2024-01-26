import axios from 'axios'
import querystring from 'querystring'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from 'src/config'

// type SpotifyTokenResponse = {
//   accessToken: string
//   refreshToken: string
// }

export class SpotifyService {
  private token: string
  protected static clientId: string = SPOTIFY_CLIENT_ID
  protected static clientSecret: string = SPOTIFY_CLIENT_SECRET
  protected static scope: string = 'user-read-private user-read-email'
  protected static redirectUri: string = 'http://localhost:8000/api/spotify/login-callback/'
  protected static spotifyTokenUrl: string = 'https://accounts.spotify.com/api/token'
  constructor(token: string) {
    this.token = token
    console.log(this.token)
  }

  static getSpotifyRedirectUri = (userState: {
    userId: string
    finalRedirect: string
  }): string => {
    const state = JSON.stringify(userState)

    const url =
      'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope: this.scope,
        redirect_uri: this.redirectUri,
        state: state
      })

    return url
  }
  static requestSpotifyToken = async (
    code: string
  ): Promise<{
    accessToken: string
    refreshToken: string
  }> => {
    let urlData = {
      code: code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code'
    }

    const spotifyAuthBuffer: Buffer = Buffer.from(this.clientId + ':' + this.clientSecret)

    const spotifyRes = await axios
      .post(this.spotifyTokenUrl, urlData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + spotifyAuthBuffer.toString('base64')
        }
      })
      .catch((error: any) => {
        throw new Error(error?.response?.data?.error_description || error)
      })

    const { access_token, refresh_token } = spotifyRes?.data
    
    return { accessToken: access_token, refreshToken: refresh_token }
  }
  search = (_: any) => ({})
  findTracks = (_: any) => ({})
  findTrackById = async (_: string): Promise<Track | null> => null
}
