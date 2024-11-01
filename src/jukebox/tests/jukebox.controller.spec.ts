import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import type { MockType } from 'src/utils'
import { AxiosProvider } from 'src/utils/providers/axios.provider'
import type { Repository } from 'typeorm'
import { Jukebox, JukeboxLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxController } from '../jukebox.controller'
import { JukeboxService } from '../jukebox.service'

describe('JukeboxController', () => {
  let controller: JukeboxController

  beforeEach(async () => {
    const mockRepo: () => MockType<Repository<Jukebox>> = jest.fn(() => ({}))
    const mockAssignmentRepo: () => MockType<Repository<JukeboxLinkAssignment>> = jest.fn(
      () => ({}),
    )
    const mockSpotifyLinkRepo: () => MockType<Repository<SpotifyAccount>> = jest.fn(() => ({}))

    const module: TestingModule = await Test.createTestingModule({
      imports: [NetworkModule],
      controllers: [JukeboxController],
      providers: [
        AxiosProvider,
        SpotifyAuthService,
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

    controller = module.get<JukeboxController>(JukeboxController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
