import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class QueueNextTrackDto {
  jukebox_id: number
}

export class AddTrackToQueueDto {
  @ApiProperty()
  track_id: string

  @ApiProperty()
  @IsOptional()
  position?: number
}

export class SwapTracksDto {
  @ApiProperty()
  current_pos: number
  target_pos: number
}
