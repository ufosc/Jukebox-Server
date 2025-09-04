import { PartialType } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator'
import { EntityDtoBase } from 'src/config/dtos'

export class JukeSessionDto extends EntityDtoBase {
  // Transforms JukeboxSession Entity Into Just The Jukebox Id
  @Expose()
  @Transform(({ obj }) => obj.jukebox?.id)
  jukebox_id: number

  @Expose()
  join_code: string

  @Expose()
  qr_code: string

  @Expose()
  next_order: number

  @Expose()
  start_at: Date

  @Expose()
  end_at: Date

  @Expose()
  is_active: boolean
}

export class CreateJukeSessionDto {
  @IsOptional()
  @IsDate()
  start_at?: Date

  @IsNotEmpty()
  @IsDate()
  end_at: Date
}

export class UpdateJukeSessionDto extends PartialType(CreateJukeSessionDto) { }
