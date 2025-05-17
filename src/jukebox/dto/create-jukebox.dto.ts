import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateJukeboxDto implements Partial<IJukebox> {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNumber()
  club_id: number
}
