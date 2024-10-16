import { getModelToken } from '@nestjs/mongoose'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import Axios from 'axios'
import { Model } from 'mongoose'
import { SpotifyLink } from '../../../_deprecated_mongo/schemas/spotify-link.schema'
import { SpotifyController } from '../spotify.controller'
import { SpotifyService } from '../spotify.service'

describe('SpotifyController', () => {
  let controller: SpotifyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotifyController],
      providers: [
        SpotifyService,
        { provide: getModelToken(SpotifyLink.name), useValue: Model<SpotifyLink> },
        {
          provide: Axios.Axios,
          useValue: Axios.create(),
        },
      ],
    }).compile()

    controller = module.get<SpotifyController>(SpotifyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
