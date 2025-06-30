import { PartialType } from '@nestjs/swagger'

export class JukeSessionDto {}
export class CreateJukeSessionDto {}
export class UpdateJukeSessionDto extends PartialType(CreateJukeSessionDto) {}
