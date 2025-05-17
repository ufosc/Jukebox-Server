import { Test, TestingModule } from '@nestjs/testing';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { MockType } from 'src/utils/testing';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TracksController', () => {
  let controller: TracksController;

  beforeEach(async () => {
    const mockRepo: () => MockType<Repository<Track>> = jest.fn(() => ({}))
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TracksController],
      providers: [TracksService, {
        provide: getRepositoryToken(Track), useFactory: mockRepo
              }],
    }).compile();

    controller = module.get<TracksController>(TracksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
