import { HttpService } from '@nestjs/axios'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkService } from 'src/network/network.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { Track } from '../entities/track.entity'
import { TrackController } from '../track.controller'
import { TrackService } from '../track.service'

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
        TrackService,
        JukeboxService,
        NetworkService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
        { provide: HttpService, useValue: {} },
      ],
    }).compile()

    controller = module.get<TrackController>(TrackController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
