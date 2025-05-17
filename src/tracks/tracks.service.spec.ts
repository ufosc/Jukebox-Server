import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { MockType } from 'src/utils/testing';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TracksService', () => {
  let service: TracksService;

  beforeEach(async () => {
    const mockRepo: () => MockType<Repository<Track>> = jest.fn(() => ({}))
    const module: TestingModule = await Test.createTestingModule({
      providers: [TracksService, {provide: getRepositoryToken(Track), useFactory: mockRepo

      }


      ],
    }).compile();

    service = module.get<TracksService>(TracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
