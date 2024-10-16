import { getModelToken } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { Model } from 'mongoose'
import { Jukebox } from '../../../_deprecated_mongo/schemas/jukebox.schema'
import { JukeboxService } from '../jukebox.service'

describe('JukeboxService', () => {
  let service: JukeboxService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JukeboxService,
        { provide: getModelToken(Jukebox.name), useValue: Model<Jukebox> },
      ],
    }).compile()

    service = module.get<JukeboxService>(JukeboxService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
