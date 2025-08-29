import { PartialType } from '@nestjs/swagger'
import { EntityDtoBase } from 'src/config/dtos'
import { Jukebox } from '../entities/jukebox.entity'

export class JukeboxDto extends EntityDtoBase<Jukebox> {
  name: string
  club_id: number
}

export class CreateJukeboxDto {
  name: string
  club_id: number
}

export class UpdateJukeboxDto extends PartialType(CreateJukeboxDto) {}
