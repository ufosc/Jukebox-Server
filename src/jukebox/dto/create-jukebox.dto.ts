import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateJukeboxDto {
  @ApiProperty()
  // @IsString()
  name: string

  @ApiProperty()
  // @IsString()
  club_id: number
}
