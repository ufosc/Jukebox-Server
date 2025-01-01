import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

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

// export class JukeboxLinkCreds implements IJukeboxLinkCreds
