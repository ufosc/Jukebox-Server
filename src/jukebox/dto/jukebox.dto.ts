import { OmitType, PartialType } from '@nestjs/swagger'
import { EntityDtoBase } from 'src/config/dtos'
import { Jukebox, TimeFormat } from '../entities/jukebox.entity'
import { Expose } from 'class-transformer'

export class JukeboxDto extends EntityDtoBase<Jukebox> {
  @Expose()
  name: string

  @Expose()
  club_id: number

  @Expose()
  time_format: TimeFormat

  @Expose()
  queue_size: number
}

export class CreateJukeboxDto {
  name: string

  club_id: number

  time_format?: TimeFormat

  queue_size?: number
}

export class UpdateJukeboxDto extends PartialType(OmitType(CreateJukeboxDto, ['club_id'] as const)) { }
