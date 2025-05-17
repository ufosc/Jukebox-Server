import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BaseDto } from 'src/config/dtos'
import { SpotifyTokensDto } from './spotify-tokens.dto'

export class CreateSpotifyAccountDto {
  user_id: number
  spotify_email: string
  tokens: SpotifyTokensDto
}

export class UpdateSpotifyAccountDto {
  access_token: string
  expires_in: number
}

export class SpotifyAccountDto extends BaseDto implements Partial<ISpotifyAccount> {
  @Expose()
  id: number

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
  expires_at: string

  @ApiProperty()
  token_type: string
}

// export class SpotifyLinkNestedDto implements IJukeboxLink {
//   @Expose()
//   @ApiProperty()
//   type: JukeboxLinkType

//   @Expose()
//   @ApiProperty()
//   email: string

//   @Expose()
//   @ApiProperty()
//   active: boolean
// }
