import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AccountLinkController } from '../account-link.controller'
import { AccountLinkService } from '../account-link.service'
import type { CreateSpotifyAccountDto } from 'src/spotify/dto'
import { SpotifyAccountDto } from 'src/spotify/dto'
import type { CreateAccountLinkDto } from '../dto'
import { NotFoundException } from '@nestjs/common'
import { AxiosMockProvider, MockCacheProvider, mockSpotifyAccount } from 'src/utils/mock'
import { DatabaseModule } from 'src/config/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountLink } from '../entities/account-link.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import type { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'
import { NetworkService } from 'src/network/network.service'

describe('AccountLinkController', () => {
  let controller: AccountLinkController

  let jukeboxService: JukeboxService
  let spotifyAuthService: SpotifyAuthService
  let jukebox1: JukeboxDto
  let jukebox2: JukeboxDto
  let jukebox3: JukeboxDto
  let jukebox4: JukeboxDto

  let jukeboxId1: number
  let jukeboxId2: number
  let jukeboxId3: number
  let jukeboxId4: number
  const clubId = 1

  const createTestAccountLink = async (
    createSpotifyAccountDto: CreateSpotifyAccountDto = mockSpotifyAccount,
  ): Promise<CreateAccountLinkDto> => {
    const spotify_account = await spotifyAuthService.addAccount(createSpotifyAccountDto)
    return {
      spotify_account,
      active: true,
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([AccountLink, SpotifyAccount, Jukebox])],
      controllers: [AccountLinkController],
      providers: [
        AxiosMockProvider,
        MockCacheProvider,
        AccountLinkService,
        SpotifyAuthService,
        JukeboxService,
        NetworkService,
      ],
    }).compile()

    controller = module.get<AccountLinkController>(AccountLinkController)

    // Services
    spotifyAuthService = module.get<SpotifyAuthService>(SpotifyAuthService)
    jukeboxService = module.get<JukeboxService>(JukeboxService)

    // Initialize objects
    jukebox1 = await jukeboxService.create({ club_id: clubId, name: 'Test Jukebox 1' })
    jukebox2 = await jukeboxService.create({ club_id: clubId, name: 'Test Jukebox 2' })
    jukebox3 = await jukeboxService.create({ club_id: clubId, name: 'Test Jukebox 1' })
    jukebox4 = await jukeboxService.create({ club_id: clubId, name: 'Test Jukebox 2' })

    jukeboxId1 = jukebox1.id
    jukeboxId2 = jukebox2.id
    jukeboxId3 = jukebox3.id
    jukeboxId4 = jukebox4.id
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should link spotify account to jukebox', async () => {
    const testAccountLinkDto1 = await createTestAccountLink()

    const result1 = await controller.create(jukeboxId1, testAccountLinkDto1)
    expect(result1.jukebox_id).toEqual(jukeboxId1)
    expect(result1.active).toBeTruthy()
    expect(result1.spotify_account).toEqual(testAccountLinkDto1.spotify_account)

    const result2 = await controller.create(jukeboxId1, testAccountLinkDto1)
    expect(result1).toEqual(result2)
  })

  it('should get all spotify accounts for a jukebox', async () => {
    const testAccountLinkDto1 = await createTestAccountLink()
    await controller.create(jukeboxId2, testAccountLinkDto1)
    const testAccountLinkDto2 = await createTestAccountLink()
    await controller.create(jukeboxId2, testAccountLinkDto2)
    const result = await controller.findAll(jukeboxId2)
    expect(result.length).toEqual(2)
  })

  it('should get spotify account for a jukebox', async () => {
    const testAccountLinkDto = await createTestAccountLink()
    const link = await controller.create(jukeboxId2, testAccountLinkDto)
    const result = await controller.findOne(link.id)
    expect(result.jukebox_id).toEqual(link.jukebox_id)
    expect(result.active).toBeTruthy()
    expect(result.spotify_account).toEqual(link.spotify_account)
  })

  it('should update a spotify account and active status for a jukebox', async () => {
    const testAccountLinkDto1 = await createTestAccountLink()
    const testAccountLinkDto2 = await createTestAccountLink()

    const result = await controller.create(jukeboxId1, testAccountLinkDto1)
    expect(result.spotify_account).toEqual(testAccountLinkDto1.spotify_account)

    const updated1 = await controller.update(result.id, testAccountLinkDto2)
    expect(updated1.spotify_account).toEqual(testAccountLinkDto2.spotify_account)

    const updated2 = await controller.update(result.id, {
      ...testAccountLinkDto2,
      spotify_account: undefined,
      active: false,
    })
    expect(updated2.active).toBeFalsy()
    expect(updated2.spotify_account).toEqual(testAccountLinkDto2.spotify_account)
  })

  it('should remove a spotify account from a jukebox', async () => {
    const testAccountLinkDto = await createTestAccountLink()
    const link = await controller.create(jukeboxId1, testAccountLinkDto)
    expect(link.jukebox_id).toEqual(jukeboxId1)
    expect(link.active).toBeTruthy()
    expect(link.spotify_account).toEqual(testAccountLinkDto.spotify_account)

    await controller.remove(link.id)
    expect(async () => await controller.findOne(link.id)).rejects.toThrow(NotFoundException)
  })

  it('should get active spotify account for a jukebox', async () => {
    const testAccountLinkDto1 = await createTestAccountLink()
    const testAccountLinkDto2 = await createTestAccountLink()

    const link1 = await controller.create(jukeboxId3, testAccountLinkDto1)
    const link2 = await controller.create(jukeboxId3, testAccountLinkDto2)

    await controller.update(link1.id, {
      ...testAccountLinkDto1,
      spotify_account: undefined,
      active: false,
    })

    const result = await controller.getActiveAccount(jukeboxId3)
    expect(result.id).toEqual(link2.id)
    expect(result.active).toBeTruthy()
  })

  it('should return null if no active spotify account', async () => {
    const testAccountLinkDto1 = await createTestAccountLink()
    const testAccountLinkDto2 = await createTestAccountLink()

    const link1 = await controller.create(jukeboxId4, testAccountLinkDto1)
    const link2 = await controller.create(jukeboxId4, testAccountLinkDto2)

    await controller.update(link1.id, {
      ...testAccountLinkDto1,
      spotify_account: undefined,
      active: false,
    })

    await controller.update(link2.id, {
      ...testAccountLinkDto2,
      spotify_account: undefined,
      active: false,
    })

    expect(async () => await controller.getActiveAccount(jukeboxId4)).rejects.toThrow(
      NotFoundException,
    )
  })
})
