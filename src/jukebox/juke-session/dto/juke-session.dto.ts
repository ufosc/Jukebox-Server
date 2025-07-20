import { PartialType } from '@nestjs/swagger'
import { EntityDtoBase } from 'src/config/dtos'
import { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'

export class JukeSessionDto extends EntityDtoBase {
  jukebox: JukeboxDto
}
export class CreateJukeSessionDto {
  jukebox: { id: number }
}
export class UpdateJukeSessionDto extends PartialType(CreateJukeSessionDto) {}
