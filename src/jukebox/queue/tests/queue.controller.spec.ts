import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { Track } from 'src/track/entities/track.entity'
import { TrackService } from 'src/track/track.service'
import { QueuedTrack } from '../entities/queued-track.entity'
import { QueueController } from '../queue.controller'
import { QueueService } from '../queue.service'
import { JukeSessionMembership } from 'src/jukebox/juke-session/entities/membership.entity'
import { JukeSession } from 'src/jukebox/juke-session/entities/juke-session.entity'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeSessionService } from 'src/jukebox/juke-session/juke-session.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import type { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'
import type { JukeSessionDto } from 'src/jukebox/juke-session/dto/juke-session.dto'
import type { JukeSessionMembershipDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { mockCreateTrack } from 'src/utils/mock/mock-create-track'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { AxiosMockProvider, mockSpotifyAccount } from 'src/utils/mock'
import type { AccountLinkDto } from 'src/jukebox/account-link/dto'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { NetworkService } from 'src/network/network.service'
import { mockTrackDetails } from 'src/utils/mock/mock-itrack-details'

describe('QueueController', () => {
  let controller: QueueController

  let jukebox: JukeboxDto
  let jukeSession1: JukeSessionDto
  let jukeSession2: JukeSessionDto
  let jukeSession3: JukeSessionDto
  let jukeSessionMembership: JukeSessionMembershipDto
  let accountLink: AccountLinkDto

  let trackService: TrackService
  let jukeSessionService: JukeSessionService
  let jukeboxService: JukeboxService
  let queueService: QueueService
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
        NetworkService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
      ],
    }).compile()

    controller = module.get<QueueController>(QueueController)
    queueService = module.get<QueueService>(QueueService)
    trackService = module.get<TrackService>(TrackService)
    jukeSessionService = module.get<JukeSessionService>(JukeSessionService)
    accountLinkService = module.get<AccountLinkService>(AccountLinkService)
    jukeboxService = module.get<JukeboxService>(JukeboxService)
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
    expect(controller).toBeDefined()
  })

  it('should add track to queue', async () => {
    queueTrackParams[0] = sessionId2

    let queue = await controller.getQueuedTracks(sessionId2, jukebox.id)
    expect(queue.tracks.length).toEqual(0)

    await controller.queueTrack(...queueTrackParams)
    queue = await controller.getQueuedTracks(sessionId2, jukebox.id)
    expect(queue.tracks.length).toEqual(1)

    await controller.queueTrack(...queueTrackParams)
    queue = await controller.getQueuedTracks(sessionId2, jukebox.id)
    expect(queue.tracks.length).toEqual(2)
  })

  it('should get track queue', async () => {
    let queue = await controller.getQueuedTracks(sessionId1, jukebox.id)
    expect(queue.tracks.length).toEqual(0)

    await controller.queueTrack(...queueTrackParams)
    queue = await controller.getQueuedTracks(sessionId1, jukebox.id)
    expect(queue.tracks.length).toEqual(1)

    await controller.queueTrack(...queueTrackParams)
    queue = await controller.getQueuedTracks(sessionId1, jukebox.id)
    expect(queue.tracks.length).toEqual(2)
  })

  it('should change order of track in queue', async () => {
    queueTrackParams[0] = sessionId3

    const track1 = await trackService.createTestTrack({ ...mockCreateTrack, spotify_id: 'abcd' })
    const track2 = await trackService.createTestTrack({ ...mockCreateTrack, spotify_id: 'bbcd' })
    const track3 = await trackService.createTestTrack({ ...mockCreateTrack, spotify_id: 'cbcd' })

    let queue = await controller.getQueuedTracks(sessionId3, jukebox.id)
    expect(queue.tracks.length).toEqual(0)

    queueTrackParams[2].spotify_track_id = track1.spotify_id
    const queueTrack1 = await controller.queueTrack(...queueTrackParams)
    queue = await controller.getQueuedTracks(sessionId3, jukebox.id)
    let q1 = await queueService.getQueuedTrackById(queueTrack1.id)
    expect(queue.tracks.length).toEqual(1)
    expect(queue.tracks[0]).toEqual(queueTrack1)
    expect(queueTrack1.order).toEqual(1)

    queueTrackParams[2].spotify_track_id = track2.spotify_id
    const queueTrack2 = await controller.queueTrack(...queueTrackParams)
    queue = await controller.getQueuedTracks(sessionId3, jukebox.id)
    q1 = await queueService.getQueuedTrackById(queueTrack1.id)
    let q2 = await queueService.getQueuedTrackById(queueTrack2.id)
    expect(queue.tracks.length).toEqual(2)
    expect(queue.tracks[0]).toEqual(q1)
    expect(queue.tracks[1]).toEqual(q2)
    expect(q1.order).toEqual(1)
    expect(q2.order).toEqual(2)

    await controller.setQueueOrder(sessionId3, jukebox.id, {
      ordering: [queueTrack2.id, queueTrack1.id],
    })
    queue = await controller.getQueuedTracks(sessionId3, jukebox.id)
    q1 = await queueService.getQueuedTrackById(queueTrack1.id)
    q2 = await queueService.getQueuedTrackById(queueTrack2.id)
    expect(queue.tracks[0]).toEqual(q2)
    expect(queue.tracks[1]).toEqual(q1)
    expect(q1.order).toEqual(2)
    expect(q2.order).toEqual(1)

    queueTrackParams[2].spotify_track_id = track3.spotify_id
    const queueTrack3 = await controller.queueTrack(...queueTrackParams)
    queue = await controller.getQueuedTracks(sessionId3, jukebox.id)
    expect(queue.tracks.length).toEqual(3)
    await controller.setQueueOrder(sessionId3, jukebox.id, {
      ordering: [queueTrack3.id, queueTrack2.id, queueTrack1.id],
    })
    queue = await controller.getQueuedTracks(sessionId3, jukebox.id)
    q1 = await queueService.getQueuedTrackById(queueTrack1.id)
    q2 = await queueService.getQueuedTrackById(queueTrack2.id)
    const q3 = await queueService.getQueuedTrackById(queueTrack3.id)
    expect(queue.tracks[0]).toEqual(q3)
    expect(queue.tracks[1]).toEqual(q2)
    expect(queue.tracks[2]).toEqual(q1)
    expect(q1.order).toEqual(3)
    expect(q2.order).toEqual(2)
    expect(q3.order).toEqual(1)
  })

  it('should clear tracks from queue', async () => {
    await controller.queueTrack(...queueTrackParams)
    await controller.queueTrack(...queueTrackParams)
    let queue = await controller.getQueuedTracks(sessionId1, jukebox.id)
    expect(queue.tracks.length).toEqual(2)

    await controller.clearQueue(sessionId1, jukebox.id)
    queue = await controller.getQueuedTracks(sessionId1, jukebox.id)
    expect(queue.tracks.length).toEqual(0)
  })
})
