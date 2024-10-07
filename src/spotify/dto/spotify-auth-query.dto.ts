import { Transform, Type } from 'class-transformer'
import { IsOptional, IsUrl, ValidateNested } from 'class-validator'

export class SpotifyAuthStateDto {
  @Type(() => String)
  userId: string

  @Type(() => String)
  @IsOptional()
  @IsUrl()
  finalRedirect?: string
}

export class SpotifyAuthQueryDto {
  @Type(() => String)
  code: string

  // @Type(() => SpotifyAuthQueryDto)
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     value = JSON.parse(value)
  //   }

  //   return value
  // })
  // @ValidateNested()
  state: SpotifyAuthStateDto
}
