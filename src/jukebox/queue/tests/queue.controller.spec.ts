import { Test, TestingModule } from '@nestjs/testing'
import { TrackService } from 'src/track/track.service'
import { QueueController } from '../queue.controller'
import { QueueService } from '../queue.service'

describe('QueueController', () => {
  let controller: QueueController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [QueueService, TrackService],
    }).compile()

    controller = module.get<QueueController>(QueueController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
