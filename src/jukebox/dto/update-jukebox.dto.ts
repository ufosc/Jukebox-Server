import { ApiProperty, PartialType } from '@nestjs/swagger'
import { SpotifyLinkNestedDto } from 'src/spotify/dto/spotify-link.dto'
import { CreateJukeboxDto } from './create-jukebox.dto'
import { IsOptional } from 'class-validator'

export class UpdateJukeboxDto {
  @IsOptional()
  @ApiProperty()
  name?: string

  @IsOptional()
  @ApiProperty()
  active_spotify_link?: SpotifyLinkNestedDto
}
