import { HttpService } from '@nestjs/axios'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeSession } from 'src/jukebox/juke-session/entities/juke-session.entity'
import { JukeSessionMembership } from 'src/jukebox/juke-session/entities/membership.entity'
import { JukeSessionService } from 'src/jukebox/juke-session/juke-session.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { QueueService } from 'src/jukebox/queue/queue.service'
import { NetworkService } from 'src/network/network.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { MockCacheProvider } from 'src/utils/mock'
import { PlayerInteraction } from '../entity/player-interaction.entity'
import { PlayerController } from '../player.controller'
import { PlayerService } from '../player.service'

describe('PlayerController', () => {
  let controller: PlayerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          PlayerInteraction,
          QueuedTrack,
          AccountLink,
          Jukebox,
          JukeSession,
          JukeSessionMembership,
          SpotifyAccount,
        ]),
      ],
      providers: [
        JukeboxService,
        PlayerService,
        SpotifyAuthService,
        AccountLinkService,
        QueueService,
        SpotifyService,
        JukeSessionService,
        NetworkService,
        { provide: HttpService, useValue: {} },
        MockCacheProvider,
      ],
    }).compile()

    controller = module.get<PlayerController>(PlayerController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
