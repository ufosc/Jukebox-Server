import { Test, TestingModule } from '@nestjs/testing'
import { PlayerController } from '../player.controller'

describe('PlayerController', () => {
  let controller: PlayerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
    }).compile()

    controller = module.get<PlayerController>(PlayerController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
