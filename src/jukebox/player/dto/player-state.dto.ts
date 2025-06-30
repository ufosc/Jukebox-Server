import { QueuedTrackDto } from 'src/jukebox/queue/dto'
import { TrackDto } from 'src/track/dto/track.dto'

export class PlayerStateDto {
  jukebox_id: number
  /**
   * Set if the current track came from the queue.
   */
  queued_track?: QueuedTrackDto
  /**
   * Set if the current track came from Spotify.
   */
  spotify_track?: TrackDto
  progress: number
  last_progress_update: Date
  is_playing: boolean
}
