import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import type { MockType } from 'src/utils'
import type { Repository } from 'typeorm'
import { Jukebox, JukeboxLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxService } from '../jukebox.service'

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
        JukeboxService,
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
