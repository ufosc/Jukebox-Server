import { JukeSessionMembershipInlineDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { TrackDto } from 'src/track/dto/track.dto'

export class QueuedTrackDto {
  queued_by: JukeSessionMembershipInlineDto
  track: TrackDto
  likes: number
  dislikes: number
  played_at?: Date
  played_order?: number
  /**
   * Is not editable if queued up in Spotify,
   * or if it was previously played.
   */
  is_editable: boolean
}
