import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { Jukebox } from '../entities/jukebox.entity'
import { JukeboxService } from '../jukebox.service'
import { Track } from 'src/track/entities/track.entity'
import { NetworkService } from 'src/network/network.service'
import { AxiosProvider } from 'src/utils/mock'

describe('JukeboxService', () => {
  let service: JukeboxService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Jukebox, Track])],
      providers: [AxiosProvider, JukeboxService, NetworkService],
    }).compile()

    service = module.get<JukeboxService>(JukeboxService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
