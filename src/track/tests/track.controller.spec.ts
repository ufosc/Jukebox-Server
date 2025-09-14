import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { Track } from '../entities/track.entity'
import { TrackController } from '../track.controller'
import { TrackService } from '../track.service'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { AxiosMockProvider } from 'src/utils/mock'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { NetworkService } from 'src/network/network.service'

describe('TrackController', () => {
  let controller: TrackController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Track, Jukebox, AccountLink, SpotifyAccount]),
      ],
      controllers: [TrackController],
      providers: [
        AxiosMockProvider,
        TrackService,
        JukeboxService,
        NetworkService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
      ],
    }).compile()

    controller = module.get<TrackController>(TrackController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
