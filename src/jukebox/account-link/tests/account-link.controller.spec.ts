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

  it('should link spotify account to jukebox', async () => {
    expect(false).toBeTruthy()
  })

  it('should get all spotify accounts for a jukebox', () => {
    expect(false).toBeTruthy()
  })

  it('should get spotify account for a jukebox', () => {
    expect(false).toBeTruthy()
  })

  it('should update a spotify account for a jukebox', () => {
    expect(false).toBeTruthy()
  })

  it('should remove a spotify account from a jukebox', () => {
    expect(false).toBeTruthy()
  })

  it('should get active spotify account for a jukebox', () => {
    expect(false).toBeTruthy()
  })

  it('should return null if no active spotify account', () => {
    expect(false).toBeTruthy()
  })
})
