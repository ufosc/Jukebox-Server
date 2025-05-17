import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class AddJukeboxLinkDto implements Partial<IJukeboxLink> {
  @ApiProperty()
  type: JukeboxLinkType

  @ApiProperty()
  @IsEmail()
  email: string
}
