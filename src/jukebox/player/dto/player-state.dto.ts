import { Expose } from 'class-transformer'
import { QueuedTrackDto } from 'src/jukebox/queue/dto'
import { TrackDto } from 'src/track/dto/track.dto'

export class PlayerStateDto {
  @Expose()
  jukebox_id: number

  /**
   * Set if the current track came from the queue.
   */
  @Expose()
  queued_track?: QueuedTrackDto

  /**
   * Set if the current track came from Spotify.
   */
  @Expose()
  spotify_track?: TrackDto

  @Expose()
  progress: number

  @Expose()
  last_progress_update: Date

  @Expose()
  is_playing: boolean

  /**
   * Spotify device id the player is playing on.
   */
  @Expose()
  current_device_id?: string

  @Expose()
  juke_session_id?: number
}
