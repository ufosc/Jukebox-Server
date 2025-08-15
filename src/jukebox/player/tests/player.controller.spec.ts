import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { QueueService } from 'src/jukebox/queue/queue.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AxiosProvider, MockCacheProvider } from 'src/utils/mock'
import { PlayerInteraction } from '../entity/player-interaction.entity'
import { PlayerController } from '../player.controller'
import { PlayerService } from '../player.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'

describe('PlayerController', () => {
  let controller: PlayerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      imports: [DatabaseModule, TypeOrmModule.forFeature([PlayerInteraction, QueuedTrack, AccountLink])],
      providers: [
        PlayerService,
        AccountLinkService,
        QueueService,
        SpotifyService,
        AxiosProvider,
        MockCacheProvider,
      ],
    }).compile()

    controller = module.get<PlayerController>(PlayerController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
