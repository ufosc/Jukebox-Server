import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AppGateway } from 'src/app.gateway'
import { SpotifyService } from 'src/spotify/spotify.service'
import { CacheMockProvider, mockRepo } from 'src/utils/testing'
import { Jukebox, JukeboxLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxGateway } from '../jukebox.gateway'
import { JukeboxService } from '../jukebox.service'
import { TrackQueueService } from '../track-queue/track-queue.service'
import { AxiosMockProvider } from 'src/utils'

describe('JukeboxGateway', () => {
  let gateway: JukeboxGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheMockProvider,
        AxiosMockProvider,
        JukeboxGateway,
        TrackQueueService,
        JukeboxService,
        SpotifyService,
        AppGateway,
        {
          provide: getRepositoryToken(Jukebox),
          useFactory: mockRepo<Jukebox>,
        },
        {
          provide: getRepositoryToken(JukeboxLinkAssignment),
          useFactory: mockRepo<JukeboxLinkAssignment>,
        },
      ],
    }).compile()

    gateway = module.get<JukeboxGateway>(JukeboxGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})
