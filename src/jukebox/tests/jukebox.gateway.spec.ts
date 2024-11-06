import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AppGateway } from 'src/app.gateway'
import { SpotifyService } from 'src/spotify/spotify.service'
import { mockCache, mockRepo } from 'src/utils'
import { Jukebox, JukeboxLinkAssignment } from '../entities/jukebox.entity'
import { JukeboxGateway } from '../jukebox.gateway'
import { JukeboxService } from '../jukebox.service'
import { TrackQueueService } from '../track-queue/track-queue.service'

describe('JukeboxGateway', () => {
  let gateway: JukeboxGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JukeboxGateway,
        TrackQueueService,
        JukeboxService,
        SpotifyService,
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
      ],
    }).compile()

    gateway = module.get<JukeboxGateway>(JukeboxGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})
