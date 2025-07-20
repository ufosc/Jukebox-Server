import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { Track } from '../entities/track.entity'
import { TrackService } from '../track.service'

describe('TrackService', () => {
  let service: TrackService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Track])],
      providers: [TrackService],
    }).compile()

    service = module.get<TrackService>(TrackService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
