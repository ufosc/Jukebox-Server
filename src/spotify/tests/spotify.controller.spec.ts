import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyController } from '../spotify.controller';

describe('SpotifyController', () => {
  let controller: SpotifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotifyController],
    }).compile();

    controller = module.get<SpotifyController>(SpotifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
