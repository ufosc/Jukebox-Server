import { JukeSessionDto } from 'src/jukebox/juke-session/dto/juke-session.dto'
import { QueuedTrackDto } from './queued-track.dto'
import { Expose } from 'class-transformer'

export class QueueDto {
  @Expose()
  juke_session: JukeSessionDto

  @Expose()
  tracks: QueuedTrackDto[]
}
