import { HttpService } from '@nestjs/axios'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { NetworkService } from './network.service'

describe('NetworkService', () => {
  let service: NetworkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkService, { provide: HttpService, useValue: {} }],
    }).compile()

    service = module.get<NetworkService>(NetworkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
