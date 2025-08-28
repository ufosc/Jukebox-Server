import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { JukeSession } from '../entities/juke-session.entity'
import { JukeSessionMembership } from '../entities/membership.entity'
import { JukeSessionService } from '../juke-session.service'
import { NetworkService } from 'src/network/network.service'
import { AxiosProvider } from 'src/utils/mock'

describe('JukeSessionService', () => {
  let service: JukeSessionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([JukeSession, JukeSessionMembership])],
      providers: [JukeSessionService, NetworkService, AxiosProvider],
    }).compile()

    service = module.get<JukeSessionService>(JukeSessionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create juke session', () => { })
  it('should create session membership', () => { })
})
