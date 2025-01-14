import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BaseDto } from 'src/config/dtos'

export class JukeboxLinkDto extends BaseDto implements IJukeboxLink {
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

// export class JukeboxLinkCreds implements IJukeboxLinkCreds
