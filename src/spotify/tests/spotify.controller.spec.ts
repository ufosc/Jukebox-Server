import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import Axios from 'axios'
import { NetworkModule } from 'src/network/network.module'
import type { MockType } from 'src/utils'
import type { Repository } from 'typeorm'
import { SpotifyLink } from '../entities/spotify-link.entity'
import { SpotifyController } from '../spotify.controller'
import { SpotifyService } from '../spotify.service'

describe('SpotifyController', () => {
  let controller: SpotifyController

  beforeEach(async () => {
    const mockSpotifyLinkRepo: () => MockType<Repository<SpotifyLink>> = jest.fn(() => ({}))
    const module: TestingModule = await Test.createTestingModule({
      imports: [NetworkModule],
      controllers: [SpotifyController],
      providers: [
        SpotifyService,
        {
          provide: Axios.Axios,
          useValue: Axios.create(),
        },
        {
          provide: getRepositoryToken(SpotifyLink),
          useFactory: mockSpotifyLinkRepo,
        },
      ],
    }).compile()

    controller = module.get<SpotifyController>(SpotifyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
