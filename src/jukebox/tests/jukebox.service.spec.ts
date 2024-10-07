import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose'
import { JukeboxService } from '../jukebox.service'
import { Jukebox } from '../schemas/jukebox.schema'

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
