import { Test, TestingModule } from '@nestjs/testing'
import { JukeSessionService } from '../juke-session.service'

describe('JukeSessionService', () => {
  let service: JukeSessionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JukeSessionService],
    }).compile()

    service = module.get<JukeSessionService>(JukeSessionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
