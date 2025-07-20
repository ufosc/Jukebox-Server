import { Expose } from 'class-transformer'
import { EntityDtoBase } from 'src/config/dtos'
import { JukeSessionMembershipInlineDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { TrackDto } from 'src/track/dto/track.dto'

export class CreateQueuedTrackDto {
  @Expose()
  queued_by: { id: number }

  @Expose()
  track: { id: number }

  @Expose()
  played_at?: Date
}

export class QueuedTrackDto extends EntityDtoBase {
  @Expose()
  queued_by: JukeSessionMembershipInlineDto

  @Expose()
  track: TrackDto

  @Expose()
  likes: number

  @Expose()
  dislikes: number

  @Expose()
  played_at?: Date

  @Expose()
  played_order?: number

  /**
   * Is not editable if queued up in Spotify,
   * or if it was previously played.
   */
  @Expose()
  is_editable: boolean
}
