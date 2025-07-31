import { JukeSessionMembershipDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { TrackService } from 'src/track/track.service'
import { CreateQueuedTrackDto } from '../dto'
import { QueueService } from '../queue.service'

// @Injectable()
// export class QueueTestFactory {
//   constructor(
//     private queueService: QueueService,
//     private trackService: TrackService,
//   ) {}

// }

export const createTestQueuedTrackFactory = (
  queueService: QueueService,
  trackService: TrackService,
) => {
  return function createTestQueuedTrack(
    jukeSessionMembership: JukeSessionMembershipDto,
    payload?: Partial<CreateQueuedTrackDto>,
  ) {
    const track = trackService.create({
      name: 'Test track',
      album: 'Example Album',
      artists: ['Acme Music'],
      release_year: 2025,
      spotify_id: 'abc123',
    })
    return queueService.createQueuedTrack({
      queued_by: { id: jukeSessionMembership.id },
      track,
      ...(payload ?? {}),
    })
  }
}
