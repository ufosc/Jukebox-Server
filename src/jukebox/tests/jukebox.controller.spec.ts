import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyLink } from 'src/spotify/entities/spotify-link.entity'
import { SpotifyService } from 'src/spotify/spotify.service'
import type { MockType } from 'src/utils'
import { AxiosProvider } from 'src/utils/providers/axios.provider'
import type { Repository } from 'typeorm'
import { Jukebox, JukeboxSpotifyLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxController } from '../jukebox.controller'
import { JukeboxService } from '../jukebox.service'

describe('JukeboxController', () => {
  let controller: JukeboxController

  beforeEach(async () => {
    const mockRepo: () => MockType<Repository<Jukebox>> = jest.fn(() => ({}))
    const mockAssignmentRepo: () => MockType<Repository<JukeboxSpotifyLinkAssignment>> = jest.fn(
      () => ({}),
    )
    const mockSpotifyLinkRepo: () => MockType<Repository<SpotifyLink>> = jest.fn(() => ({}))

    const module: TestingModule = await Test.createTestingModule({
      imports: [NetworkModule],
      controllers: [JukeboxController],
      providers: [
        AxiosProvider,
        SpotifyService,
        JukeboxService,
        {
          provide: getRepositoryToken(Jukebox),
          useFactory: mockRepo,
        },
        {
          provide: getRepositoryToken(JukeboxSpotifyLinkAssignment),
          useFactory: mockAssignmentRepo,
        },
        {
          provide: getRepositoryToken(SpotifyLink),
          useFactory: mockSpotifyLinkRepo,
        },
      ],
    }).compile()

    controller = module.get<JukeboxController>(JukeboxController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
