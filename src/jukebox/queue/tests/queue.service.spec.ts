import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { QueuedTrack } from '../entities/queued-track.entity'
import { QueueService } from '../queue.service'
import { Track } from 'src/track/entities/track.entity'
import { JukeSessionService } from 'src/jukebox/juke-session/juke-session.service'
import { JukeSession } from 'src/jukebox/juke-session/entities/juke-session.entity'
import { JukeSessionMembership } from 'src/jukebox/juke-session/entities/membership.entity'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { AxiosMockProvider, mockSpotifyAccount } from 'src/utils/mock'
import type { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'
import type { JukeSessionDto } from 'src/jukebox/juke-session/dto/juke-session.dto'
import type { JukeSessionMembershipDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { TrackService } from 'src/track/track.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { mockCreateTrack } from 'src/utils/mock/mock-create-track'
import { QueueController } from '../queue.controller'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import type { AccountLinkDto } from 'src/jukebox/account-link/dto'
import { NetworkService } from 'src/network/network.service'
import { mockTrackDetails } from 'src/utils/mock/mock-itrack-details'

describe('QueueService', () => {
  let controller: QueueController
  let service: QueueService

  let jukebox: JukeboxDto
  let jukeSession1: JukeSessionDto
  let jukeSession2: JukeSessionDto
  let jukeSession3: JukeSessionDto
  let jukeSessionMembership: JukeSessionMembershipDto
  let accountLink: AccountLinkDto

  let trackService: TrackService
  let jukeSessionService: JukeSessionService
  let jukeboxService: JukeboxService
  let accountLinkService: AccountLinkService
  let spotifyAuthService: SpotifyAuthService

  let sessionId1: number
  let sessionId2: number
  let sessionId3: number

  let queueTrackParams: Parameters<typeof controller.queueTrack>

  beforeAll(() => {
    jest.spyOn(JukeSessionService.prototype, 'generateQrCode').mockResolvedValue('')
    jest.spyOn(SpotifyService.prototype, 'getTrack').mockResolvedValue(mockTrackDetails)
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          QueuedTrack,
          Track,
          JukeSessionMembership,
          JukeSession,
          Jukebox,
          AccountLink,
          SpotifyAccount,
        ]),
      ],
      controllers: [QueueController],
      providers: [
        AxiosMockProvider,
        QueueService,
        TrackService,
        JukeSessionService,
        JukeboxService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
        NetworkService,
        { provide: SpotifyService, useValue: { queueTrack: jest.fn().mockResolvedValue(true) } },
      ],
    }).compile()

    controller = module.get<QueueController>(QueueController)
    service = module.get<QueueService>(QueueService)

    trackService = module.get<TrackService>(TrackService)
    jukeSessionService = module.get<JukeSessionService>(JukeSessionService)
    jukeboxService = module.get<JukeboxService>(JukeboxService)
    accountLinkService = module.get<AccountLinkService>(AccountLinkService)
    spotifyAuthService = module.get<SpotifyAuthService>(SpotifyAuthService)

    jukebox = await jukeboxService.create({ name: 'Test Jukebox', club_id: 1 })
    jukeSession1 = await jukeSessionService.create(jukebox.id, {
      end_at: new Date(new Date().getTime() + 30 * 60 * 1000),
    })
    jukeSession2 = await jukeSessionService.create(jukebox.id, {
      end_at: new Date(new Date().getTime() + 30 * 60 * 1000),
    })
    jukeSession3 = await jukeSessionService.create(jukebox.id, {
      end_at: new Date(new Date().getTime() + 30 * 60 * 1000),
    })
    jukeSessionMembership = await jukeSessionService.createMembership(jukeSession1.id, {
      user_id: 1,
    })
    accountLink = await accountLinkService.create(jukebox.id, {
      spotify_account: await spotifyAuthService.addAccount(mockSpotifyAccount),
    })

    sessionId1 = jukeSession1.id
    sessionId2 = jukeSession2.id
    sessionId3 = jukeSession3.id

    queueTrackParams = [
      sessionId1,
      jukebox.id,
      { spotify_track_id: mockCreateTrack.spotify_id, queued_by: { id: jukeSessionMembership.id } },
    ]
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get, pop, remove a queued track and preserve order', async () => {
    await controller.queueTrack(...queueTrackParams)
    let queuedTrackToRemain = await controller.queueTrack(...queueTrackParams)
    const queuedTrackToBeRemoved = await controller.queueTrack(...queueTrackParams)

    let queue = await controller.getQueuedTracks(sessionId1)
    const getQueuedTrack = await service.getNextTrack(sessionId1)
    expect(getQueuedTrack).toEqual(queue.tracks[0])

    const popQueuedTrack = await service.popNextTrack(sessionId1)
    const queueLengthBeforePop = queue.tracks.length
    expect(popQueuedTrack).toEqual(queue.tracks[0])

    queue = await controller.getQueuedTracks(sessionId1)
    expect(queueLengthBeforePop - 1).toEqual(queue.tracks.length)

    await service.removeTrackFromQueue(sessionId1, queuedTrackToBeRemoved.id)
    const queueLengthBeforeRemove = queue.tracks.length
    queue = await controller.getQueuedTracks(sessionId1)
    expect(queueLengthBeforeRemove - 1).toEqual(queue.tracks.length)

    queuedTrackToRemain = await service.getQueuedTrackById(queuedTrackToRemain.id)
    expect(queuedTrackToRemain).toEqual(queue.tracks[0])
  })

  it('should play a queued track', async () => {
    queueTrackParams[0] = sessionId2

    await controller.queueTrack(...queueTrackParams)
    const popQueuedTrack = await service.popNextTrack(sessionId2)
    await service.playQueuedTrack(popQueuedTrack.id)
    const queuedTrack = await service.getQueuedTrackById(popQueuedTrack.id)
    expect(queuedTrack.is_editable).toBeFalsy()
    expect(queuedTrack.played).toBeTruthy()
  })

  it('should queue a track to spotify', async () => {
    queueTrackParams[0] = sessionId3

    await controller.queueTrack(...queueTrackParams)
    await service.queueNextTrackToSpotify(jukebox.id, sessionId3)
    const queue = await controller.getQueuedTracks(sessionId3)
    expect(queue.tracks[0].is_editable).toBeFalsy()
  })
})
