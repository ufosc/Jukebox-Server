import { PartialType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { EntityDtoBase } from 'src/config/dtos'
import { Track } from '../entities/track.entity'

export class TrackDto extends EntityDtoBase<Track> {
  name: string
  album: string
  release_year: number
  artists: string[]
  spotify_id: string
  spotify_uri: string
  duration_ms: number
  is_explicit: boolean
  preview_url: string | null
}

export class CreateTrackDto {
  @Expose()
  name: string

  @Expose()
  album: string

  @Expose()
  release_year: number

  @Expose()
  artists: string[]

  @Expose()
  spotify_id: string

  @Expose()
  spotify_uri?: string

  @Expose()
  duration_ms: number

  @Expose()
  is_explicit: boolean

  @Expose()
  preview_url: string | null
}
export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
