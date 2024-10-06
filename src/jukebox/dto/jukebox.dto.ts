import { ApiProperty } from '@nestjs/swagger'
import { SpotifyLinkDto } from 'src/spotify/dto/spotify-link.dto'

export class JukeboxDto {
  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty()
  clubId: string

  @ApiProperty()
  spotifyLinks: SpotifyLinkDto[]

  @ApiProperty()
  activeSpotifyLink?: SpotifyLinkDto
}
