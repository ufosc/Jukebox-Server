import { QueuedTrackDto } from 'src/jukebox/queue/dto'
import { IQueueService, QueueService } from 'src/jukebox/queue/queue.service'

class MockQueueService implements IQueueService {
  getNextTrack(jukeboxId: number): Promise<QueuedTrackDto> {
    throw new Error('Method not implemented.')
  }
}

export const MockQueueServiceProvider = {
  provide: QueueService,
  useValue: new MockQueueService(),
}
