import { HttpService } from '@nestjs/axios'
import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import type { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { PlayerInteraction } from 'src/jukebox/player/entity/player-interaction.entity'
import { PlayerService } from 'src/jukebox/player/player.service'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { QueueService } from 'src/jukebox/queue/queue.service'
import { NetworkService } from 'src/network/network.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import type { TrackDto } from 'src/track/dto/track.dto'
import { Track } from 'src/track/entities/track.entity'
import { TrackService } from 'src/track/track.service'
import { MockCacheProvider, mockUser } from 'src/utils/mock'
import { DataSource } from 'typeorm'
import type { CreateJukeSessionDto } from '../dto/juke-session.dto'
import { JukeSession } from '../entities/juke-session.entity'
import { JukeSessionMembership } from '../entities/membership.entity'
import { JukeSessionController } from '../juke-session.controller'
import { JukeSessionService } from '../juke-session.service'

const getEndAtDate = (hours = 2) => new Date(new Date().getTime() + 1000 * 60 * 60 * hours)

describe('JukeSessionController', () => {
  let module: TestingModule
  let controller: JukeSessionController

  let queueService: QueueService
  let jukeboxService: JukeboxService
  let trackService: TrackService
  let jukeSessionService: JukeSessionService

  let jukebox: JukeboxDto
  let jukebox2: JukeboxDto
  let track: TrackDto

  const userId = 2
  const clubId = 3

  beforeAll(() => {
    jest.spyOn(JukeSessionService.prototype, 'generateQrCode').mockResolvedValue('')
  })

  const createTestJukeSession = async (
    payload?: Partial<CreateJukeSessionDto & { jukebox_id: number }>,
  ) => {
    const jukeboxId = payload?.jukebox_id ?? jukebox.id
    try {
      const activeSession = await jukeSessionService.getCurrentSession(jukeboxId)
      await jukeSessionService.update(activeSession.id, { is_active: false })
    } catch (err: any) {
      if (!(err instanceof NotFoundException)) {
        throw err
      }
    }

    const session = await jukeSessionService.create(
      jukeboxId,
      {
        end_at: getEndAtDate(),
        ...(payload ?? {}),
      },
      mockUser.token,
    )
    return session
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          Jukebox,
          JukeSession,
          JukeSessionMembership,
          PlayerInteraction,
          QueuedTrack,
          Track,
          AccountLink,
          SpotifyAccount,
        ]),
      ],
      controllers: [JukeSessionController],
      providers: [
        MockCacheProvider,
        JukeSessionService,
        PlayerService,
        SpotifyService,
        QueueService,
        {
          provide: NetworkService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: { axiosRef: { post: async (...args) => {} } },
        },
        JukeboxService,
        TrackService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
      ],
    }).compile()

    controller = module.get<JukeSessionController>(JukeSessionController)

    // Services
    queueService = module.get<QueueService>(QueueService)
    jukeboxService = module.get<JukeboxService>(JukeboxService)
    trackService = module.get<TrackService>(TrackService)
    jukeSessionService = module.get<JukeSessionService>(JukeSessionService)

    // Initialize objects
    jukebox = await jukeboxService.create({ club_id: clubId, name: 'Test Jukebox' })
    jukebox2 = await jukeboxService.create({ club_id: clubId, name: 'Test Jukebox 2' })
    track = await trackService.createTestTrack({
      name: 'Test track',
      album: 'Example Album',
      artists: ['Acme Music'],
      release_year: 2025,
      spotify_id: 'abc123',
      duration_ms: 0,
      is_explicit: false,
      preview_url: null,
    })
  })

  afterEach(async () => {
    const datasource = module.get<DataSource>(DataSource)
    await datasource.dropDatabase()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a juke session', async () => {
    const result = await controller.create(
      jukebox.id,
      {
        end_at: getEndAtDate(),
      },
      mockUser,
    )

    // Cannot create juke session when one is active
    await expect(
      controller.create(
        jukebox.id,
        {
          end_at: getEndAtDate(),
        },
        mockUser,
      ),
    ).rejects.toThrow(InternalServerErrorException)
    await controller.update(result.id, jukebox.id, { is_active: false })

    expect(result).toBeDefined()
    expect(result.jukebox_id).toEqual(jukebox.id)
    expect(result.join_code).not.toBeNull()
    expect(result.start_at).not.toBeNull()
  })

  it('should get juke session', async () => {
    const session = await createTestJukeSession()
    const result = await controller.findOne(jukebox.id, session.id)
    expect(result.end_at).toEqual(session.end_at)
  })

  it('should get current juke session', async () => {
    const session = await createTestJukeSession()
    const result = await controller.getCurrentSession(jukebox.id)
    expect(result.start_at).toEqual(session.start_at)
    expect(result.end_at).toEqual(session.end_at)
    expect(result.join_code).toEqual(session.join_code)
  })

  it('should find all juke sessions for jukebox', async () => {
    await createTestJukeSession({
      start_at: new Date('17:00:00 7/28/25'),
      end_at: new Date('19:00:00 7/28/25'),
    })
    await createTestJukeSession({
      start_at: new Date('17:00:00 7/29/25'),
      end_at: new Date('19:00:00 7/29/25'),
    })
    await createTestJukeSession({
      jukebox_id: jukebox2.id,
      start_at: new Date('17:00:00 7/29/25'),
      end_at: new Date('19:00:00 7/29/25'),
    })
    const result = await controller.findAll(jukebox.id)
    expect(result.length).toEqual(2)
  })

  it('should update a juke session', async () => {
    const session = await createTestJukeSession()
    const newEndAt = getEndAtDate(3)
    const result = await controller.update(session.id, jukebox.id, { end_at: newEndAt })
    expect(result.end_at).toEqual(newEndAt)
  })

  it('should delete a juke session', async () => {
    const session = await createTestJukeSession()
    await controller.remove(jukebox.id, session.id)
    await expect(controller.findOne(jukebox.id, session.id)).rejects.toThrow(NotFoundException)
  })

  it('should end a juke session', async () => {
    const session = await createTestJukeSession()
    const result = await controller.update(session.id, jukebox.id, { is_active: false })
    expect(result.end_at).not.toEqual(session.end_at)
    expect(result.is_active).toBeFalsy()
    expect(result.end_at.getHours()).toEqual(new Date().getHours())
    expect(result.end_at.getMinutes()).toEqual(new Date().getMinutes())
  })

  it('should add juke session members', async () => {
    const session = await createTestJukeSession()
    const result = await controller.addJukeSessionMember(jukebox.id, session.id, { user_id: 1 })
    expect(result.user_id).toEqual(1)
  })

  it('should get members for a juke session', async () => {
    const session = await createTestJukeSession()
    const memberCount = 25
    const membershipLength = 7
    for (let i = 0; i < memberCount; i++) {
      await jukeSessionService.createMembership(session.id, { user_id: i + 1 })
    }

    let result = await controller.getJukeSessionMembers(
      session.jukebox_id,
      session.id,
      0,
      membershipLength,
    )
    expect(result.memberships.length).toEqual(membershipLength)
    expect(result.memberships[0].user_id).toBeLessThan(result.memberships[1].user_id)
    expect(result.count).toEqual(memberCount)

    result = await controller.getJukeSessionMembers(session.jukebox_id, session.id, 1)
    expect(result.memberships.length).toEqual(membershipLength)
    expect(result.memberships[0].user_id).toBeLessThan(result.memberships[1].user_id)

    result = await controller.getJukeSessionMembers(session.jukebox_id, session.id, 2)
    expect(result.memberships.length).toEqual(membershipLength)
    expect(result.memberships[0].user_id).toBeLessThan(result.memberships[1].user_id)

    result = await controller.getJukeSessionMembers(session.jukebox_id, session.id, 3)
    expect(result.memberships.length).toEqual(4)
    expect(result.count).toEqual(memberCount)
  })

  it('should get single member for a juke session', async () => {
    const session = await createTestJukeSession()
    const member = await jukeSessionService.createMembership(session.id, { user_id: 1 })
    await jukeSessionService.createMembership(session.id, { user_id: 2 })

    const result = await controller.getJukeSessionMember(jukebox.id, member.id)
    expect(result.user_id).toEqual(1)
  })

  it('should delete juke session member', async () => {
    const session = await createTestJukeSession()
    const member = await jukeSessionService.createMembership(session.id, { user_id: 1 })
    await jukeSessionService.createMembership(session.id, { user_id: 2 })

    const result = await controller.deleteJukeSessionMembership(jukebox.id, member.id)
    expect(result.user_id).toEqual(1)
    await expect(controller.getJukeSessionMember(jukebox.id, member.id)).rejects.toThrow(
      NotFoundException,
    )
  })

  it('should add a member to a session by join code', async () => {
    const session = await createTestJukeSession()
    const testUserId = 3
    const membership = await controller.addJukeSessionMemberByJoinCode(
      jukebox.id,
      session.join_code,
      {
        user_id: testUserId,
      },
    )

    expect(membership.user_id).toEqual(testUserId)
  })

  it('should get queued tracks for a member', async () => {
    const session = await createTestJukeSession()
    const testUserId = 4
    const membership = await controller.addJukeSessionMemberByJoinCode(
      jukebox.id,
      session.join_code,
      {
        user_id: testUserId,
      },
    )
    await queueService.queueTrack(session.id, { queued_by: { id: membership.id }, track })

    const membershipWithQueued = await controller.getJukeSessionMember(jukebox.id, membership.id)
    expect(membershipWithQueued.queued_tracks[0]).toEqual(track.id)
  })
})
