import { ApiProperty } from '@nestjs/swagger'

export class CreateJukeboxDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  clubId: string
}
