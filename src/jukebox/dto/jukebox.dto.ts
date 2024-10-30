import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BaseDto } from 'src/config/dtos'

export class JukeboxLinkDto implements IJukeboxLink {
  @Expose()
  @ApiProperty()
  id: number

  @Expose()
  @ApiProperty()
  type: JukeboxLinkType

  @Expose()
  @ApiProperty()
  email: string

  @Expose()
  @ApiProperty()
  active: boolean
}

export class JukeboxDto extends BaseDto implements IJukebox {
  @Expose()
  @ApiProperty()
  id: number

  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  club_id: number

  @Expose()
  @ApiProperty()
  links: JukeboxLinkDto[]

  // static serialize(entity: Jukebox): JukeboxDto {
  //   return {
  //     ...super.serialize(entity),
  //     name: entity.name,
  //     club_id: entity.club_id,
  //     links:
  //       entity.spotify_link_assignments?.map((assignment) => ({
  //         type: 'spotify',
  //         email: assignment.spotify_link.spotify_email,
  //         active: assignment.active,
  //       })) ?? [],
  //   }
  // }
}
