import { OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { TrackDto } from 'src/track/dto/track.dto'

enum UpdateActionType {
  PLAYED = 'played',
  PAUSED = 'paused',
  CHANGED_TRACKS = 'changed_tracks',
  PROGRESS = 'progress',
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
  @IsNumber()
  duration_ms?: number

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  timestamp?: Date

  @IsOptional()
  @ValidateNested()
  @Type(() => TrackDto)
  spotify_track?: TrackDto
}

export class PlayerJoinDto extends OmitType(PlayerAuxUpdateDto, [
  'action' as const,
  'progress' as const,
  'timestamp' as const,
  'spotify_track' as const,
]) {
  jukebox_id: any
}
