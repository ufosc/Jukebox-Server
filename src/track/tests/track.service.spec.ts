import { HttpService } from '@nestjs/axios'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import type { AccountLinkDto } from 'src/jukebox/account-link/dto'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import type { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkService } from 'src/network/network.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { mockSpotifyAccount } from 'src/utils/mock'
import { mockCreateTrack } from 'src/utils/mock/mock-create-track'
import { mockTrackDetails } from 'src/utils/mock/mock-track-details'
import { DataSource } from 'typeorm'
import { Track } from '../entities/track.entity'
import { TrackService } from '../track.service'

describe('TrackService', () => {
  let module: TestingModule
  let service: TrackService

  let jukeboxService: JukeboxService
  let accountLinkService: AccountLinkService
  let spotifyAuthService: SpotifyAuthService

  let jukebox: JukeboxDto
  let accountLink: AccountLinkDto

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Track, Jukebox, AccountLink, SpotifyAccount]),
      ],
      providers: [
        TrackService,
        JukeboxService,
        NetworkService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
        {
          provide: SpotifyService,
          useValue: { getTrack: jest.fn().mockResolvedValue(mockTrackDetails) },
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<TrackService>(TrackService)

    jukeboxService = module.get<JukeboxService>(JukeboxService)
    accountLinkService = module.get<AccountLinkService>(AccountLinkService)
    spotifyAuthService = module.get<SpotifyAuthService>(SpotifyAuthService)

    jukebox = await jukeboxService.create({ name: 'Test Jukebox', club_id: 1 })
    accountLink = await accountLinkService.create(jukebox.id, {
      spotify_account_id: (await spotifyAuthService.addAccount(mockSpotifyAccount)).id,
    })
  })

  afterEach(async () => {
    const datasource = module.get<DataSource>(DataSource)
    await datasource.dropDatabase()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create and find a track', async () => {
    const track = await service.create(mockCreateTrack)
    expect(track.name).toEqual(mockCreateTrack.name)

    const foundTrack = await service.getTrack(track.spotify_id, jukebox.id)
    expect(foundTrack.spotify_id).toEqual(track.spotify_id)

    await expect(service.create({ ...mockCreateTrack, spotify_uri: '' })).rejects.toThrow(Error)
  })

  it('should create a local reference to a track if it does not exist', async () => {
    const track = await service.getTrack('abc', jukebox.id)
    expect(track.id).toBeTruthy()
    expect(track.album).toEqual(mockTrackDetails.album.name)
  })
})
