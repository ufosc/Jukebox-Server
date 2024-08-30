import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { stringify } from 'querystring'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from 'src/config'

type TokenResponse = {
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export class SpotifyService {
  private accessToken: string
  protected static clientId: string = SPOTIFY_CLIENT_ID
  protected static clientSecret: string = SPOTIFY_CLIENT_SECRET
  protected static scope: string = 'user-read-private user-read-email'
  protected static redirectUri: string = 'http://localhost:8000/api/spotify/login-callback/'
  protected static spotifyTokenUrl: string = 'https://accounts.spotify.com/api/token'
  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private static requestAuthorization = async (
    body:
      | {
          grant_type: 'authorization_code'
          code: string
          redirect_uri: string
        }
      | {
          grant_type: 'refresh_token'
          refresh_token: string
        }
  ): Promise<AxiosResponse<any, any>> => {
    const spotifyAuthBuffer: Buffer = Buffer.from(this.clientId + ':' + this.clientSecret)

    const spotifyRes = await axios
      .post(this.spotifyTokenUrl, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + spotifyAuthBuffer.toString('base64')
        }
      })
      .catch((error: any) => {
        console.log('Error authorizing with spotify:', error)
        throw new Error(error?.response?.data?.error_description || error)
      })

    if (spotifyRes.status > 299 || !spotifyRes.data)
      throw new Error('Error authenticating with spotify.')

    return spotifyRes
  }

  private static getExpiresAt = (expiresIn: number): Date => new Date(Date.now() / 1000 + expiresIn)

  static getSpotifyRedirectUri = (userState: {
    userId: string
    finalRedirect: string
    groupId: string
  }): string => {
    const state = JSON.stringify(userState)

    const url =
      'https://accounts.spotify.com/authorize?' +
      stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope: this.scope,
        redirect_uri: this.redirectUri,
        state: state
      })

    return url
  }
  static requestSpotifyToken = async (code: string): Promise<TokenResponse> => {
    const spotifyRes = await this.requestAuthorization({
      code: code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code'
    })

    const { access_token, refresh_token, expires_in } = spotifyRes.data
    const expiresAt = this.getExpiresAt(expires_in)

    return { accessToken: access_token, refreshToken: refresh_token, expiresAt }
  }

  static refreshUserToken = async (refreshToken: string): Promise<TokenResponse> => {
    const spotifyRes = await this.requestAuthorization({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })

    const { access_token, refresh_token, expires_in } = spotifyRes.data
    const expiresAt = this.getExpiresAt(expires_in)

    return { accessToken: access_token, refreshToken: refresh_token, expiresAt }
  }

  getProfile = async (): Promise<SpotifyUserProfile> => {
    const res = await axios
      .get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
      .catch((error: any) => {
        console.log('error getting profile:', error)
        throw error
      })

    return res.data
  }
}
