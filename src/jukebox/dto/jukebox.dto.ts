import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BaseDto } from 'src/config/dtos'
import { JukeboxLinkDto } from './jukebox-link.dto'

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
}
