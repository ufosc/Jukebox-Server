import { PartialType } from '@nestjs/swagger'
import { SpotifyAccountDto } from 'src/spotify/dto'

export class AccountLinkDto {
  jukebox_id: number
  spotify_account: SpotifyAccountDto
  active: boolean
}
export class CreateAccountLinkDto {
  jukebox_id: number
  spotify_account: SpotifyAccountDto
  active: boolean
}
export class UpdateAccountLinkDto extends PartialType(CreateAccountLinkDto) {}
