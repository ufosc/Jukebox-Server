import { Test, TestingModule } from '@nestjs/testing'
import { AccountLinkController } from '../account-link.controller'
import { AccountLinkService } from '../account-link.service'

describe('AccountLinkController', () => {
  let controller: AccountLinkController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountLinkController],
      providers: [AccountLinkService],
    }).compile()

    controller = module.get<AccountLinkController>(AccountLinkController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
