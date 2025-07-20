import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkModule } from 'src/network/network.module'
import { AxiosMockProvider } from 'src/utils/mock'
import { SpotifyAccount } from '../entities/spotify-account.entity'
import { SpotifyAuthService } from '../spotify-auth.service'
import { SpotifyController } from '../spotify.controller'
import { SpotifyService } from '../spotify.service'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'

describe('SpotifyController', () => {
  let controller: SpotifyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NetworkModule, DatabaseModule, TypeOrmModule.forFeature([SpotifyAccount, Jukebox])],
      controllers: [SpotifyController],
      providers: [
        SpotifyAuthService,
        SpotifyService,
        AccountLinkService,
        AxiosMockProvider,
        JukeboxService,
      ],
    }).compile()

    controller = module.get<SpotifyController>(SpotifyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
