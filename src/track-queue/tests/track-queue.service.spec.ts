import { Test, TestingModule } from '@nestjs/testing';
import { TrackQueueService } from '../track-queue.service';

describe('TrackQueueService', () => {
  let service: TrackQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackQueueService],
    }).compile();

    service = module.get<TrackQueueService>(TrackQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
