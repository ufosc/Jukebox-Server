import { EntityDtoBase } from 'src/config/dtos'
import { JukeSessionMembership } from '../entities/membership.entity'

export class JukeSessionMembershipInlineDto {
  juke_session: number
  user_id: number
}

export class JukeSessionMembershipDto extends EntityDtoBase<JukeSessionMembership> {
  juke_session: number
  user_id: number
  queued_tracks: number[]
}
