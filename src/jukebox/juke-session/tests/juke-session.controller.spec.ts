import { Test, TestingModule } from '@nestjs/testing'
import { JukeSessionController } from '../juke-session.controller'
import { JukeSessionService } from '../juke-session.service'

describe('JukeSessionController', () => {
  let controller: JukeSessionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JukeSessionController],
      providers: [JukeSessionService],
    }).compile()

    controller = module.get<JukeSessionController>(JukeSessionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
