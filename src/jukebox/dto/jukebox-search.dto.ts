import { IsNotEmpty, IsString } from 'class-validator'

export class JukeboxSearchDto {
  @IsNotEmpty()
  @IsString()
  trackQuery: string

  @IsNotEmpty()
  @IsString()
  albumQuery: string

  @IsNotEmpty()
     @IsString()
  artistQuery: string
}
