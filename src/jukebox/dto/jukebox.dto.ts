import { OmitType, PartialType } from '@nestjs/swagger'
import { EntityDtoBase } from 'src/config/dtos'
import { Jukebox, TimeFormat } from '../entities/jukebox.entity'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

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
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  club_id: number

  @IsOptional()
  @IsEnum(TimeFormat)
  time_format?: TimeFormat

  @IsOptional()
  @IsNumber()
  queue_size?: number
}

export class UpdateJukeboxDto extends PartialType(
  OmitType(CreateJukeboxDto, ['club_id'] as const),
) {}
