import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
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

export class SpotifyLinkDto {
  @Expose()
  id: string

  @Expose()
  accessToken: string

  @Expose()
  refreshToken: string

  @Expose()
  userId: string

  @Expose()
  spotifyEmail: string

  @Expose()
  expiresIn: number

  @Expose()
  expiresAt: Date

  @Expose()
  tokenType: string
}

export class SpotifyLinkSummaryDto extends PartialType(SpotifyLinkDto) {
  
  @Expose()
  @ApiProperty()
  id: string
  
  @Expose()
  @ApiProperty()
  accessToken: string

  @Expose()
  @ApiProperty()
  userId: string

  @Expose()
  @ApiProperty()
  spotifyEmail: string

  @Expose()
  @ApiProperty()
  expiresIn: number

  @Expose()
  @ApiProperty()
  expiresAt: Date

  @Expose()
  @ApiProperty()
  tokenType: string
}
