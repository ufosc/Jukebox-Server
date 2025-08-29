import { TrackDto } from "src/track/dto/track.dto"

export class PlayerAuxUpdateDto {
  jukebox_id: number
  action: 'played' | 'paused' | 'changed_tracks' | 'other'
  progress?: number
  timestamp?: Date
  current_track?: TrackDto
}