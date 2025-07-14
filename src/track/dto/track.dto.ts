import { PartialType } from '@nestjs/swagger'
import { EntityDtoBase } from 'src/config/dtos'
import { Track } from '../entities/track.entity'

export class TrackDto extends EntityDtoBase<Track> {
  name: string
  album: string
  release_year: number
  artists: string[]
  spotify_id: string
  spotify_uri: string
}
export class CreateTrackDto {
  name: string
  album: string
  release_year: number
  artists: string[]
  spotify_id?: string
}
export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
