import { PartialType } from '@nestjs/swagger'
import { EntityDtoBase } from 'src/config/dtos'
import { Track } from '../entities/track.entity'
import { Expose } from 'class-transformer'

export class TrackDto extends EntityDtoBase<Track> {
  name: string
  album: string
  release_year: number
  artists: string[]
  spotify_id: string
  spotify_uri: string
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
}
export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
