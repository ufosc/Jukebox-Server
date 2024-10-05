import { SpotifyTokensDto } from './spotify-tokens.dto'

export class CreateSpotifyLinkDto {
  userId: string
  spotifyEmail: string
  tokens: SpotifyTokensDto
}

export class UpdateSpotifyLinkDto {
  accessToken: string
  expiresIn: number
}
