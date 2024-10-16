import { getModelToken } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import Axios from 'axios'
import { Model } from 'mongoose'
import { MockType } from 'src/utils'
import { Repository } from 'typeorm'
import { SpotifyLink } from '../entities/spotify-link.entity'
import { SpotifyService } from '../spotify.service'

describe('SpotifyService', () => {
  let service: SpotifyService

  beforeEach(async () => {
    const mockSpotifyLinkRepo: () => MockType<Repository<SpotifyLink>> = jest.fn(() => ({}))
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
        { provide: getModelToken(SpotifyLink.name), useValue: Model<SpotifyLink> },
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

    service = module.get<SpotifyService>(SpotifyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
