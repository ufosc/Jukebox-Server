import { getModelToken } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { Model } from 'mongoose'
import { JukeboxController } from '../jukebox.controller'
import { JukeboxService } from '../jukebox.service'
import { Jukebox } from '../schemas/jukebox.schema'

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
