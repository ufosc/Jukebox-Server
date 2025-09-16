import { Expose } from 'class-transformer'
import { EntityDtoBase } from 'src/config/dtos'
import { JukeSessionMembership } from '../entities/membership.entity'
import { JukeSessionDto } from './juke-session.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class JukeSessionMembershipInlineDto {
  @Expose()
  juke_session: JukeSessionDto

  @Expose()
  user_id: number
}

export class JukeSessionMembershipDto extends EntityDtoBase<JukeSessionMembership> {
  @Expose()
  juke_session: number

  @Expose()
  user_id: number

  @Expose()
  queued_tracks: number[]
}

export class JukeSessionMembershipCountDto {
  @Expose()
  memberships: JukeSessionMembershipDto[]

  @Expose()
  count: number
}

export class CreateJukeSessionMembershipDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number
}
