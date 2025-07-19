import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AxiosProvider } from 'src/utils/mock/mock-axios-provider'
import { NetworkService } from './network.service'

describe('NetworkService', () => {
  let service: NetworkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkService, AxiosProvider],
    }).compile()

    service = module.get<NetworkService>(NetworkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
