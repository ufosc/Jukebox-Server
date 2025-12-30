import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { NetworkService } from 'src/network/network.service'
import { JukeSession } from '../entities/juke-session.entity'
import { JukeSessionMembership } from '../entities/membership.entity'
import { JukeSessionService } from '../juke-session.service'

describe('JukeSessionService', () => {
  let service: JukeSessionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([JukeSession, JukeSessionMembership])],
      providers: [
        JukeSessionService,
        {
          provide: NetworkService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<JukeSessionService>(JukeSessionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
