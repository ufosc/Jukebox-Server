import { Test, TestingModule } from '@nestjs/testing';
import { JukeboxService } from '../jukebox.service';

describe('JukeboxService', () => {
  let service: JukeboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JukeboxService],
    }).compile();

    service = module.get<JukeboxService>(JukeboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
