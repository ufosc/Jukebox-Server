import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { Track } from '../entities/track.entity'
import { TrackController } from '../track.controller'
import { TrackService } from '../track.service'

describe('TrackController', () => {
  let controller: TrackController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Track])],
      controllers: [TrackController],
      providers: [TrackService],
    }).compile()

    controller = module.get<TrackController>(TrackController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
