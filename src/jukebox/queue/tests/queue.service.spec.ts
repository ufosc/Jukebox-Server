import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { QueuedTrack } from '../entities/queued-track.entity'
import { QueueService } from '../queue.service'
import { Track } from 'src/track/entities/track.entity'

describe('QueueService', () => {
  let service: QueueService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([QueuedTrack, Track])],
      providers: [QueueService],
    }).compile()

    service = module.get<QueueService>(QueueService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
