import { getModelToken } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import Axios from 'axios'
import { Model } from 'mongoose'
import { SpotifyLink } from '../../../_deprecated_mongo/schemas/spotify-link.schema'
import { SpotifyService } from '../spotify.service'

describe('SpotifyService', () => {
  let service: SpotifyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
        { provide: getModelToken(SpotifyLink.name), useValue: Model<SpotifyLink> },
        {
          provide: Axios.Axios,
          useValue: Axios.create(),
        },
      ],
    }).compile()

    service = module.get<SpotifyService>(SpotifyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
