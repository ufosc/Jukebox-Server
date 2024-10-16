import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SpotifyLink } from 'src/spotify/entities/spotify-link.entity'
import { MockType } from 'src/utils'
import { Repository } from 'typeorm'
import { Jukebox, JukeboxSpotifyLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxService } from '../jukebox.service'

describe('JukeboxService', () => {
  let service: JukeboxService

  beforeEach(async () => {
    const mockRepo: () => MockType<Repository<Jukebox>> = jest.fn(() => ({}))
    const mockAssignmentRepo: () => MockType<Repository<JukeboxSpotifyLinkAssignment>> = jest.fn(
      () => ({}),
    )
    const mockSpotifyLinkRepo: () => MockType<Repository<SpotifyLink>> = jest.fn(() => ({}))

    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<JukeboxService>(JukeboxService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
