import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { SpotifyLinkDto } from 'src/spotify/dto/spotify-link.dto'

export class JukeboxDto {
  @Expose()
  @ApiProperty()
  id: string

  @Expose()
  @ApiProperty({ type: 'string' })
  name: string

  @Expose()
  @ApiProperty()
  clubId: string

  @Expose()
  @ApiProperty()
  spotifyLinks: SpotifyLinkDto[]

  @Expose()
  @ApiProperty()
  activeSpotifyLink?: SpotifyLinkDto
}
