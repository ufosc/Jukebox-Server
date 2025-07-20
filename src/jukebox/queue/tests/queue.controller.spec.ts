import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { Track } from 'src/track/entities/track.entity'
import { TrackService } from 'src/track/track.service'
import { QueuedTrack } from '../entities/queued-track.entity'
import { QueueController } from '../queue.controller'
import { QueueService } from '../queue.service'

describe('QueueController', () => {
  let controller: QueueController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([QueuedTrack, Track])],
      controllers: [QueueController],
      providers: [QueueService, TrackService],
    }).compile()

    controller = module.get<QueueController>(QueueController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
