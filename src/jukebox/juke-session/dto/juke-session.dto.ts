import { PartialType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { EntityDtoBase } from 'src/config/dtos'

export class JukeSessionDto extends EntityDtoBase {
  @Expose()
  jukebox_id: number
  @Expose()
  join_code: string
  @Expose()
  start_at: Date
  @Expose()
  end_at: Date
  @Expose()
  is_active: boolean
}
export class CreateJukeSessionDto {
  // @Expose()
  // jukebox_id: number
  @Expose()
  start_at?: Date
  @Expose()
  end_at: Date
}
export class UpdateJukeSessionDto extends PartialType(CreateJukeSessionDto) {}
