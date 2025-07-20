import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { JukeSession } from '../entities/juke-session.entity'
import { JukeSessionController } from '../juke-session.controller'
import { JukeSessionService } from '../juke-session.service'
import { JukeSessionMembership } from '../entities/membership.entity'

describe('JukeSessionController', () => {
  let controller: JukeSessionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([JukeSession, JukeSessionMembership])],
      controllers: [JukeSessionController],
      providers: [JukeSessionService],
    }).compile()

    controller = module.get<JukeSessionController>(JukeSessionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
