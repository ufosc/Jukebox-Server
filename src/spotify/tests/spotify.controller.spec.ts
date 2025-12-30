import { HttpService } from '@nestjs/axios'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyAccount } from '../entities/spotify-account.entity'
import { SpotifyAuthService } from '../spotify-auth.service'
import { SpotifyController } from '../spotify.controller'
import { SpotifyService } from '../spotify.service'

describe('SpotifyController', () => {
  let controller: SpotifyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NetworkModule,
        DatabaseModule,
        TypeOrmModule.forFeature([SpotifyAccount, Jukebox, AccountLink]),
      ],
      controllers: [SpotifyController],
      providers: [
        SpotifyAuthService,
        SpotifyService,
        AccountLinkService,
        JukeboxService,
        { provide: HttpService, useValue: {} },
      ],
    }).compile()

    controller = module.get<SpotifyController>(SpotifyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
