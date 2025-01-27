import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class UpdateJukeboxDto implements Partial<IJukeboxUpdate> {
  @IsOptional()
  @ApiProperty()
  name?: string
}
