/**
 * Resources
 * - Repo: https://github.com/spotify/spotify-web-api-ts-sdk/tree/main
 * - Authentication: https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 * - Scopes: https://developer.spotify.com/documentation/web-api/concepts/scopes
 */
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import axios from 'axios'
import { stringify } from 'querystring'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from 'server/config'

const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'streaming'
]

export type SpotifySdk = SpotifyApi

export interface SpotifyTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

type SpotifyAuthReqBody =
  | {
      grant_type: 'authorization_code'
      code: string
      redirect_uri: string
    }
  | {
      grant_type: 'refresh_token'
      refresh_token: string
    }

export const getSpotifySdk = (tokens: SpotifyTokens): SpotifySdk => {
  return SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expires_in: tokens.expiresIn,
    token_type: tokens.tokenType
  })
}

export const getSpotifyRedirectUri = (state: { userId: string; finalRedirect?: string }) => {
  const stateString = JSON.stringify(state)

  const url =
    'https://accounts.spotify.com/authorize?' +
    stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: SPOTIFY_SCOPES.join(', '),
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: stateString
    })

  return url
}

export const authenticateSpotify = async (params: {
  type: 'authorization_code' | 'refresh_token'
  payload: string
}): Promise<SpotifyTokens> => {
  const body: SpotifyAuthReqBody =
    params.type === 'authorization_code'
      ? {
          grant_type: params.type,
          code: params.payload,
          redirect_uri: SPOTIFY_REDIRECT_URI
        }
      : {
          grant_type: params.type,
          refresh_token: params.payload
        }
  const spotifyAuthBuffer: Buffer = Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)

  const spotifyRes = await axios
    .post('https://accounts.spotify.com/api/token', body, {
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

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: tokenType
  } = spotifyRes.data

  return { accessToken, refreshToken, expiresIn, tokenType }
}

export const getSpotifyEmail = async (tokens: SpotifyTokens) => {
  const sdk = getSpotifySdk(tokens)
  const userProfile = await sdk.currentUser.profile()

  return userProfile.email
}
