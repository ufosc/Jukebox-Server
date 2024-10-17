import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class AddJukeboxLinkDto {
  @ApiProperty()
  @IsEmail()
  spotifyEmail: string
}
