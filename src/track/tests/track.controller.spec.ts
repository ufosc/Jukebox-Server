import { Test, TestingModule } from '@nestjs/testing'
import { TrackController } from '../track.controller'
import { TrackService } from '../track.service'

describe('TrackController', () => {
  let controller: TrackController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [TrackService],
    }).compile()

    controller = module.get<TrackController>(TrackController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
