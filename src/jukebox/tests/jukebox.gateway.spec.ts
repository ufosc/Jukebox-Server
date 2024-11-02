import { Test, TestingModule } from '@nestjs/testing';
import { JukeboxGateway } from '../jukebox.gateway';

describe('JukeboxGateway', () => {
  let gateway: JukeboxGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JukeboxGateway],
    }).compile();

    gateway = module.get<JukeboxGateway>(JukeboxGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
