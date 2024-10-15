import { ApiProperty } from '@nestjs/swagger'

export class AddJukeboxLinkDto {
  @ApiProperty()
  spotifyEmail: string
}
