import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BaseDto } from 'src/config/dtos'
import { SpotifyLinkDto, SpotifyLinkNestedDto } from 'src/spotify/dto/spotify-link.dto'
import { Jukebox } from '../entities/jukebox.entity'

export class JukeboxDto extends BaseDto {
  @Expose()
  @ApiProperty()
  id: number

  @Expose()
  @ApiProperty({ type: 'string' })
  name: string

  @Expose()
  @ApiProperty()
  club_id: number

  @Expose()
  @ApiProperty()
  spotify_links: SpotifyLinkNestedDto[]

  @Expose()
  @ApiProperty()
  active_spotify_link?: SpotifyLinkDto

  static serialize(entity: Jukebox): JukeboxDto {
    return {
      ...super.serialize(entity),
      name: entity.name,
      club_id: entity.club_id,
      spotify_links: entity.spotify_link_assignments?.map((assignment) => ({
        spotify_email: assignment.spotify_link.spotify_email,
      })) ?? [],
      active_spotify_link: entity.spotify_link_assignments?.find((assignment) => assignment.active)
      ?.spotify_link,
    }
  }
}
