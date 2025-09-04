import { Expose } from 'class-transformer'
import { EntityDtoBase } from 'src/config/dtos'
import { JukeSessionDto } from 'src/jukebox/juke-session/dto/juke-session.dto'
import { JukeSessionMembershipInlineDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { TrackDto } from 'src/track/dto/track.dto'

export class QueuedTrackDto extends EntityDtoBase {
  @Expose()
  juke_session: JukeSessionDto

  @Expose()
  queued_by: JukeSessionMembershipInlineDto

  @Expose()
  track: TrackDto

  @Expose()
  likes: number

  @Expose()
  dislikes: number

  @Expose()
  played: boolean

  @Expose()
  played_at?: Date

  @Expose()
  order: number

  /**
   * Is not editable if queued up in Spotify,
   * or if it was previously played.
   */
  @Expose()
  is_editable: boolean
}
