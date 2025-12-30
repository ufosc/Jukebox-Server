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
import type { JukeSessionDto } from 'src/jukebox/juke-session/dto/juke-session.dto'
import type { JukeSessionMembershipDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { JukeSession } from 'src/jukebox/juke-session/entities/juke-session.entity'
import { JukeSessionMembership } from 'src/jukebox/juke-session/entities/membership.entity'
import { JukeSessionService } from 'src/jukebox/juke-session/juke-session.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkService } from 'src/network/network.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { Track } from 'src/track/entities/track.entity'
import { TrackService } from 'src/track/track.service'
import { mockSpotifyAccount, mockUser } from 'src/utils/mock'
import { mockCreateTrack } from 'src/utils/mock/mock-create-track'
import { mockTrackDetails } from 'src/utils/mock/mock-track-details'
import { DataSource } from 'typeorm'
import { QueuedTrack } from '../entities/queued-track.entity'
import { QueueController } from '../queue.controller'
import { QueueService } from '../queue.service'

describe('QueueService', () => {
  let module: TestingModule
  let controller: QueueController
  let service: QueueService

  let jukebox: JukeboxDto
  let jukeSession: JukeSessionDto
  let jukeSessionMembership: JukeSessionMembershipDto
  let accountLink: AccountLinkDto

  let trackService: TrackService
  let jukeSessionService: JukeSessionService
  let jukeboxService: JukeboxService
  let accountLinkService: AccountLinkService
  let spotifyAuthService: SpotifyAuthService

  let sessionId: number

  let queueTrackParams: Parameters<typeof controller.queueTrack>

  beforeEach(async () => {
    module = await Test.createTestingModule({
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
        { provide: HttpService, useValue: {} },
        QueueService,
        TrackService,
        JukeSessionService,
        JukeboxService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
        NetworkService,
      ],
    }).compile()

    jest.spyOn(JukeSessionService.prototype, 'generateQrCode').mockResolvedValue('')
    jest.spyOn(SpotifyService.prototype, 'getTrack').mockResolvedValue(mockTrackDetails)
    jest.spyOn(SpotifyService.prototype, 'queueTrack').mockResolvedValue()

    controller = module.get<QueueController>(QueueController)
    service = module.get<QueueService>(QueueService)

    trackService = module.get<TrackService>(TrackService)
    jukeSessionService = module.get<JukeSessionService>(JukeSessionService)
    jukeboxService = module.get<JukeboxService>(JukeboxService)
    accountLinkService = module.get<AccountLinkService>(AccountLinkService)
    spotifyAuthService = module.get<SpotifyAuthService>(SpotifyAuthService)

    jukebox = await jukeboxService.create({ name: 'Test Jukebox', club_id: 1 })
    jukeSession = await jukeSessionService.create(
      jukebox.id,
      {
        end_at: new Date(new Date().getTime() + 30 * 60 * 1000),
      },
      mockUser.token,
    )
    sessionId = jukeSession.id
    jukeSessionMembership = await jukeSessionService.createMembership(sessionId, {
      user_id: 1,
    })
    accountLink = await accountLinkService.create(jukebox.id, {
      spotify_account_id: (await spotifyAuthService.addAccount(mockSpotifyAccount)).id,
    })

    queueTrackParams = [
      sessionId,
      jukebox.id,
      { spotify_track_id: mockCreateTrack.spotify_id, queued_by: { id: jukeSessionMembership.id } },
    ]
  })

  afterEach(async () => {
    const datasource = module.get<DataSource>(DataSource)
    await datasource.dropDatabase()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get, pop, remove a queued track and preserve order', async () => {
    await controller.queueTrack(...queueTrackParams)
    let queuedTrackToRemain = await controller.queueTrack(...queueTrackParams)
    const queuedTrackToBeRemoved = await controller.queueTrack(...queueTrackParams)

    let queue = await controller.getQueuedTracks(sessionId, jukebox.id)
    const getQueuedTrack = await service.getNextTrack(sessionId)
    expect(getQueuedTrack).toEqual(queue.tracks[0])

    const popQueuedTrack = await service.popNextTrack(sessionId)
    const queueLengthBeforePop = queue.tracks.length
    expect(popQueuedTrack).toEqual(queue.tracks[0])

    queue = await controller.getQueuedTracks(sessionId, jukebox.id)
    expect(queueLengthBeforePop - 1).toEqual(queue.tracks.length)

    await service.removeTrackFromQueue(sessionId, queuedTrackToBeRemoved.id)
    const queueLengthBeforeRemove = queue.tracks.length
    queue = await controller.getQueuedTracks(sessionId, jukebox.id)
    expect(queueLengthBeforeRemove - 1).toEqual(queue.tracks.length)

    queuedTrackToRemain = await service.getQueuedTrackById(queuedTrackToRemain.id)
    expect(queuedTrackToRemain).toEqual(queue.tracks[0])
  })

  it('should play a queued track', async () => {
    queueTrackParams[0] = sessionId

    await controller.queueTrack(...queueTrackParams)
    const popQueuedTrack = await service.popNextTrack(sessionId)
    await service.playQueuedTrack(popQueuedTrack.id)
    const queuedTrack = await service.getQueuedTrackById(popQueuedTrack.id)
    expect(queuedTrack.is_editable).toBeFalsy()
    expect(queuedTrack.played).toBeTruthy()
  })

  it('should queue a track to spotify', async () => {
    queueTrackParams[0] = sessionId

    await controller.queueTrack(...queueTrackParams)
    await service.queueNextTrackToSpotify(jukebox.id, sessionId)
    const queue = await controller.getQueuedTracks(sessionId, jukebox.id)
    expect(queue.tracks[0].is_editable).toBeFalsy()
  })
})
