import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { TrackDto } from 'src/track/dto/track.dto'

enum UpdateActionType {
  PLAYED = 'played',
  PAUSED = 'paused',
  CHANGED_TRACKS = 'changed_tracks',
  OTHER = 'other',
}

export class PlayerAuxUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  jukebox_id: number

  @IsNotEmpty()
  @IsEnum(UpdateActionType)
  action: UpdateActionType

  @IsOptional()
  @IsNumber()
  progress?: number

  @IsOptional()
  @IsDate()
  timestamp?: Date

  @IsOptional()
  @ValidateNested()
  @Type(() => TrackDto)
  current_track?: TrackDto
}
