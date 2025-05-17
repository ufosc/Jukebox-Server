import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import Axios from 'axios'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyService } from 'src/spotify/spotify.service'
import type { MockType } from 'src/utils/testing'
import type { Repository } from 'typeorm'
import { Jukebox, JukeboxLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxService } from '../jukebox.service'
import { TrackQueueService } from '../track-queue/track-queue.service'

describe('JukeboxService', () => {
  let service: JukeboxService

  beforeEach(async () => {
    const mockRepo: () => MockType<Repository<Jukebox>> = jest.fn(() => ({}))
    const mockAssignmentRepo: () => MockType<Repository<JukeboxLinkAssignment>> = jest.fn(
      () => ({}),
    )
    const mockSpotifyLinkRepo: () => MockType<Repository<SpotifyAccount>> = jest.fn(() => ({}))

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Axios.Axios,
          useValue: Axios.create(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
        JukeboxService,
        SpotifyService,
        TrackQueueService,
        {
          provide: getRepositoryToken(Jukebox),
          useFactory: mockRepo,
        },
        {
          provide: getRepositoryToken(JukeboxLinkAssignment),
          useFactory: mockAssignmentRepo,
        },
        {
          provide: getRepositoryToken(SpotifyAccount),
          useFactory: mockSpotifyLinkRepo,
        },
      ],
    }).compile()

    service = module.get<JukeboxService>(JukeboxService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
