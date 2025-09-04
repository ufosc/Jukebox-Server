import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"

export class IdDto {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class CreateQueuedTrackDto {
  @ValidateNested()
  @Type(() => IdDto)
  queued_by: IdDto

  @ValidateNested()
  @Type(() => IdDto)
  track: IdDto
}

export class QueueUpTrackDto {
  @ValidateNested()
  @Type(() => IdDto)
  queued_by: IdDto

  @IsNotEmpty()
  @IsString()
  spotify_track_id: string
}

