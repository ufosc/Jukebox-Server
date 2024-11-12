import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { mockCache } from 'src/utils/testing'
import { TrackQueueService } from '../track-queue.service'

describe('TrackQueueService', () => {
  let service: TrackQueueService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackQueueService, mockCache],
    }).compile()

    service = module.get<TrackQueueService>(TrackQueueService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
