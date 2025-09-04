import { PartialType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { EntityDtoBase } from 'src/config/dtos'
import { SpotifyAccountDto } from 'src/spotify/dto'

export class CreateAccountLinkDto {
  @IsOptional()
  @IsNumber()
  jukebox_id?: number

  @ValidateNested()
  @Type(() => SpotifyAccountDto)
  spotify_account: SpotifyAccountDto

  @IsOptional()
  @IsBoolean()
  active?: boolean
}

export class AccountLinkDto extends EntityDtoBase {
  // jukebox_id is hydrated into jukebox, this maps it to the correct name
  @Expose({ name: 'jukebox' })
  jukebox_id: number

  @Expose()
  spotify_account: SpotifyAccountDto

  @Expose()
  active: boolean
}

export class UpdateAccountLinkDto extends PartialType(CreateAccountLinkDto) {}
