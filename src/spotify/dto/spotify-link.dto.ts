import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BaseDto } from 'src/config/dtos'
import { SpotifyTokensDto } from './spotify-tokens.dto'

export class CreateSpotifyLinkDto {
  user_id: number
  spotify_email: string
  tokens: SpotifyTokensDto
}

export class UpdateSpotifyLinkDto {
  access_token: string
  expires_in: number
}

export class SpotifyLinkDto extends BaseDto {
  @Expose()
  @ApiProperty()
  access_token: string

  @Expose()
  @ApiProperty()
  user_id: number

  @Expose()
  @ApiProperty()
  spotify_email: string

  expires_in: number

  @Expose()
  @ApiProperty()
  expires_at: Date

  @ApiProperty()
  token_type: string
}

export class SpotifyLinkNestedDto {
  @Expose()
  @ApiProperty()
  spotify_email: string
}
