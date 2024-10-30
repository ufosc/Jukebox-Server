import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class UpdateJukeboxDto implements Partial<IJukebox> {
  @IsOptional()
  @ApiProperty()
  name?: string
}
