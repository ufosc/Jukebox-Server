import { Test, TestingModule } from '@nestjs/testing';
import { JukeboxController } from '../jukebox.controller';
import { JukeboxService } from '../jukebox.service';

describe('JukeboxController', () => {
  let controller: JukeboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JukeboxController],
      providers: [JukeboxService],
    }).compile();

    controller = module.get<JukeboxController>(JukeboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
