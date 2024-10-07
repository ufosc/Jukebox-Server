import { ApiProperty, PartialType } from '@nestjs/swagger'
import { SpotifyLink } from '../schemas/spotify-link.schema'
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

export class SpotifyLinkDto extends PartialType(SpotifyLink) {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  spotifyEmail: string

  @ApiProperty()
  expiresIn: number

  @ApiProperty()
  expiresAt: Date

  @ApiProperty()
  tokenType: string
}
