import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkModule } from 'src/network/network.module'
import { AxiosProvider } from 'src/utils'
import type { MockType } from 'src/utils/testing'
import type { Repository } from 'typeorm'
import { SpotifyAccount } from '../entities/spotify-account.entity'
import { SpotifyAuthService } from '../spotify-auth.service'
import { SpotifyController } from '../spotify.controller'
import { SpotifyService } from '../spotify.service'

describe('SpotifyController', () => {
  let controller: SpotifyController

  beforeEach(async () => {
    const mockSpotifyLinkRepo: () => MockType<Repository<SpotifyAccount>> = jest.fn(() => ({}))
    const module: TestingModule = await Test.createTestingModule({
      imports: [NetworkModule],
      controllers: [SpotifyController],
      providers: [
        SpotifyAuthService,
        SpotifyService,
        AccountLinkService,
        AxiosProvider,
        {
          provide: JukeboxService,
          useValue: {
            addLinkToJukebox: async (jukeboxId: number, account: SpotifyAccount) => {},
          },
        },
        {
          provide: getRepositoryToken(SpotifyAccount),
          useFactory: mockSpotifyLinkRepo,
        },
      ],
    }).compile()

    controller = module.get<SpotifyController>(SpotifyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
