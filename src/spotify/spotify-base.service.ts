import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { SPOTIFY_CLIENT_ID } from 'src/config'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { Axios } from 'axios'

export class SpotifyBaseService {
  // constructor(protected axios: Axios) {} 
  protected getSdk(tokens: SpotifyTokensDto) {
    return SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
    })
  }
}
