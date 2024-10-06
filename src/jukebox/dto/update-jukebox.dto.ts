import { ApiProperty, PartialType } from '@nestjs/swagger'
import { SpotifyLinkDto } from 'src/spotify/dto/spotify-link.dto'
import { CreateJukeboxDto } from './create-jukebox.dto'

export class UpdateJukeboxDto extends PartialType(CreateJukeboxDto) {
  @ApiProperty()
  name: string

  @ApiProperty()
  activeSpotifyLink: SpotifyLinkDto
}
