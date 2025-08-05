import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { PlayerInteraction } from 'src/jukebox/player/entity/player-interaction.entity'
import { PlayerService } from 'src/jukebox/player/player.service'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { QueueService } from 'src/jukebox/queue/queue.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { TrackDto } from 'src/track/dto/track.dto'
import { Track } from 'src/track/entities/track.entity'
import { TrackService } from 'src/track/track.service'
import { AxiosMockProvider, MockCacheProvider } from 'src/utils/mock'
import { CreateJukeSessionDto } from '../dto/juke-session.dto'
import { JukeSession } from '../entities/juke-session.entity'
import { JukeSessionMembership } from '../entities/membership.entity'
import { JukeSessionController } from '../juke-session.controller'
import { JukeSessionService } from '../juke-session.service'

function getEndAtDate(hours = 2) {
  return new Date(new Date().getTime() + 1000 * 60 * 60 * hours)
}

describe('JukeSessionController', () => {
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

  const createTestJukeSession = async (
    payload?: Partial<CreateJukeSessionDto & { jukebox_id: number }>,
  ) => {
    const session = await jukeSessionService.create(payload?.jukebox_id ?? jukebox.id, {
      end_at: getEndAtDate(),
      ...(payload ?? {}),
    })
    return session
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          Jukebox,
          JukeSession,
          JukeSessionMembership,
          PlayerInteraction,
          QueuedTrack,
          Track,
        ]),
      ],
      controllers: [JukeSessionController],
      providers: [
        AxiosMockProvider,
        MockCacheProvider,
        JukeSessionService,
        PlayerService,
        SpotifyService,
        QueueService,
        JukeboxService,
        TrackService,
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
    track = trackService.create({
      name: 'Test track',
      album: 'Example Album',
      artists: ['Acme Music'],
      release_year: 2025,
      spotify_id: 'abc123',
    })
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a juke session', async () => {
    const result = await controller.create(String(jukebox.id), {
      end_at: getEndAtDate(),
    })
    expect(result).toBeDefined()
    expect(result.jukebox_id).toEqual(jukebox.id)
    expect(result.join_code).not.toBeNull()
    expect(result.start_at).not.toBeNull()
  })

  it('should get juke session', async () => {
    const session = await createTestJukeSession()
    console.log('test jukebox id:', jukebox.id)
    const result = await controller.findOne(String(jukebox.id), String(session.id))
    expect(result.end_at).toEqual(session.end_at)
  })

  it('should get current juke session', async () => {
    const session = await createTestJukeSession()
    const result = await controller.getCurrentSession(String(jukebox.id))
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
    const result = await controller.findAll(String(jukebox.id))
    expect(result.length).toEqual(2)
  })

  it('should update a juke session', async () => {
    const session = await createTestJukeSession()
    const newEndAt = getEndAtDate(3)
    const result = await controller.update(String(jukebox.id), String(session.id), {
      end_at: newEndAt,
    })
    expect(result.end_at).toEqual(newEndAt)
  })

  it('should delete a juke session', async () => {
    const session = await createTestJukeSession()
    await controller.remove(String(jukebox.id), String(session.id))
    expect(() => controller.findOne(String(jukebox.id), String(session.id))).toThrow(
      NotFoundException,
    )
  })

  it('should end a juke session', async () => {
    const session = await createTestJukeSession()
    const result = await controller.endJukeSession(String(jukebox.id), String(session.id))
    expect(result.end_at).not.toEqual(session.end_at)
    expect(result.end_at.getHours()).toEqual(new Date().getHours())
    expect(result.end_at.getMinutes()).toEqual(new Date().getMinutes())
  })

  it('should add juke session members', async () => {
    const session = await createTestJukeSession()
    const result = await controller.addJukeSessionMember(String(jukebox.id), String(session.id), {
      user_id: 1,
    })
    expect(result.user_id).toEqual(1)
  })

  it('should get members for a juke session', async () => {
    const session = await createTestJukeSession()
    const memberCount = 3
    for (let i = 0; i < memberCount; i++) {
      await jukeSessionService.createMembership(session.id, { user_id: i + 1 })
    }

    const result = await controller.getJukeSessionMembers(String(jukebox.id), String(session.id))
    expect(result.length).toEqual(memberCount)
  })

  it('should get single member for a juke session', async () => {
    const session = await createTestJukeSession()
    const member = await jukeSessionService.createMembership(session.id, { user_id: 1 })
    await jukeSessionService.createMembership(session.id, { user_id: 2 })

    const result = await controller.getJukeSessionMember(
      String(jukebox.id),
      String(session.id),
      String(member.id),
    )
    expect(result.user_id).toEqual(1)
  })

  it('should delete juke session member', async () => {
    const session = await createTestJukeSession()
    const member = await jukeSessionService.createMembership(session.id, { user_id: 1 })
    await jukeSessionService.createMembership(session.id, { user_id: 2 })

    const result = await controller.deleteJukeSessionMembership(
      String(jukebox.id),
      String(session.id),
      String(member.id),
    )
    expect(result.user_id).toEqual(1)
    expect(() =>
      controller.getJukeSessionMember(String(jukebox.id), String(session.id), String(member.id)),
    ).toThrow(NotFoundException)
  })
})
