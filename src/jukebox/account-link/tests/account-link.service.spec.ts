import { Test, TestingModule } from '@nestjs/testing'
import { AccountLinkService } from '../account-link.service'

describe('AccountLinkService', () => {
  let service: AccountLinkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountLinkService],
    }).compile()

    service = module.get<AccountLinkService>(AccountLinkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
