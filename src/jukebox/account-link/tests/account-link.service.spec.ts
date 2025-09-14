import { Test, TestingModule } from '@nestjs/testing'
import { AccountLinkService } from '../account-link.service'
import { DatabaseModule } from 'src/config/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountLink } from '../entities/account-link.entity'

describe('AccountLinkService', () => {
  let service: AccountLinkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([AccountLink])],
      providers: [AccountLinkService],
    }).compile()

    service = module.get<AccountLinkService>(AccountLinkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
