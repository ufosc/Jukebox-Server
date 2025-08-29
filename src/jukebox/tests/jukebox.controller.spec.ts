import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { Track } from 'src/track/entities/track.entity'
import { Jukebox } from '../entities/jukebox.entity'
import { JukeboxController } from '../jukebox.controller'
import { JukeboxService } from '../jukebox.service'

describe('JukeboxController', () => {
  let controller: JukeboxController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Jukebox, Track])],
      controllers: [JukeboxController],
      providers: [JukeboxService],
    }).compile()

    controller = module.get<JukeboxController>(JukeboxController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
