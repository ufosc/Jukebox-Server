import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BaseDto } from 'src/config/dtos'
import { SpotifyTokensDto } from './spotify-tokens.dto'

export class CreateSpotifyLinkDto{
  user_id: string
  spotify_email: string
  tokens: SpotifyTokensDto
}

export class UpdateSpotifyLinkDto {
  access_token: string
  expires_in: number
}

export class SpotifyLinkDto extends BaseDto {
  @ApiProperty()
  access_token: string
  
  // @ApiProperty()
  // refresh_token: string
  
  @ApiProperty()
  user_id: string
  
  @ApiProperty()
  spotify_email: string
  
  // @ApiProperty()
  // expires_in: number
  
  @ApiProperty()
  expires_at: Date
  
  @ApiProperty()
  token_type: string
}

// export class SpotifyLinkSummaryDto extends PartialType(SpotifyLinkDto) {
//   @ApiProperty()
//   access_token: string

//   @ApiProperty()
//   user_id: string

//   @ApiProperty()
//   spotify_email: string

//   @ApiProperty()
//   expires_in: number

//   @ApiProperty()
//   expires_at: Date

//   @ApiProperty()
//   token_type: string
// }

export class SpotifyLinkNestedDto {
  @Expose()
  @ApiProperty()
  spotify_email: string
}
