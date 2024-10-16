import { getModelToken } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { Model } from 'mongoose'
import { Jukebox } from '../../../_deprecated_mongo/schemas/jukebox.schema'
import { JukeboxController } from '../jukebox.controller'
import { JukeboxService } from '../jukebox.service'

describe('JukeboxController', () => {
  let controller: JukeboxController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JukeboxController],
      providers: [
        JukeboxService,
        { provide: getModelToken(Jukebox.name), useValue: Model<Jukebox> },
      ],
    }).compile()

    controller = module.get<JukeboxController>(JukeboxController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
