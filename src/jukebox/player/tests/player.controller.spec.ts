import { Test, TestingModule } from '@nestjs/testing'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AxiosProvider, getMockRepo, MockCacheProvider, MockQueueServiceProvider } from 'src/utils'
import { PlayerInteraction } from '../entity/player-interaction.entity'
import { PlayerController } from '../player.controller'
import { PlayerService } from '../player.service'

describe('PlayerController', () => {
  let controller: PlayerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        getMockRepo(PlayerInteraction),
        PlayerService,
        SpotifyService,
        AccountLinkService,
        AxiosProvider,
        MockCacheProvider,
        MockQueueServiceProvider,
      ],
    }).compile()

    controller = module.get<PlayerController>(PlayerController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
