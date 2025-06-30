import { JukeSessionDto } from 'src/jukebox/juke-session/dto/juke-session.dto'
import { QueuedTrackDto } from './queued-track.dto'

export class QueueDto {
  juke_session: JukeSessionDto
  tracks: QueuedTrackDto[]
}
