import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';

export enum TrackInteraction {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export class LikeDislikeTrackDto {
  @ApiProperty({ description: 'The index of the track in the queue' })
  @IsInt()
  @Min(0)
  queue_index: number;

  @ApiProperty({ description: 'The interaction type', enum: TrackInteraction })
  @IsEnum(TrackInteraction)
  action: TrackInteraction;
}
