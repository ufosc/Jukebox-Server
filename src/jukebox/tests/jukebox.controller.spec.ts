import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AppGateway } from 'src/app.gateway'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AxiosProvider } from 'src/utils/providers/axios.provider'
import { mockCache, mockRepo } from 'src/utils/testing'
import { Jukebox, JukeboxLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxController } from '../jukebox.controller'
import { JukeboxService } from '../jukebox.service'
import { TrackQueueService } from '../track-queue/track-queue.service'

describe('JukeboxController', () => {
  let controller: JukeboxController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NetworkModule],
      controllers: [JukeboxController],
      providers: [
        AxiosProvider,
        SpotifyAuthService,
        JukeboxService,
        SpotifyService,
        TrackQueueService,
        AppGateway,
        mockCache,
        {
          provide: getRepositoryToken(Jukebox),
          useFactory: mockRepo<Jukebox>,
        },
        {
          provide: getRepositoryToken(JukeboxLinkAssignment),
          useFactory: mockRepo<JukeboxLinkAssignment>,
        },
        {
          provide: getRepositoryToken(SpotifyAccount),
          useFactory: mockRepo<SpotifyAccount>,
        },
      ],
    }).compile()

    controller = module.get<JukeboxController>(JukeboxController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
