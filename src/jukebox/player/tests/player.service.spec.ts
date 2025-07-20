import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { plainToInstance } from 'class-transformer'
import { DatabaseModule } from 'src/config/database.module'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeSession } from 'src/jukebox/juke-session/entities/juke-session.entity'
import { JukeSessionMembership } from 'src/jukebox/juke-session/entities/membership.entity'
import { JukeSessionService } from 'src/jukebox/juke-session/juke-session.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { CreateQueuedTrackDto, QueuedTrackDto } from 'src/jukebox/queue/dto'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { QueueService } from 'src/jukebox/queue/queue.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { Track } from 'src/track/entities/track.entity'
import { TrackService } from 'src/track/track.service'
import { AxiosMockProvider, MockCacheProvider, mockUser } from 'src/utils/mock'
import { PlayerStateDto } from '../dto'
import { InteractionType, PlayerInteraction } from '../entity/player-interaction.entity'
import { PlayerService } from '../player.service'

describe('PlayerService', () => {
  let service: PlayerService
  let cache: Cache
  let initialPlayerState: PlayerStateDto
  let module: TestingModule
  let queueService: QueueService

  let queuedTrack: QueuedTrack
  let jukebox: Jukebox
  let jukeSession: JukeSession
  let jukeboxService: JukeboxService
  let jukeSessionService: JukeSessionService
  let trackService: TrackService
  let jukeSessionMembership: JukeSessionMembership
  let track: Track

  const cacheKey = 'jukebox-1'
  const jukeboxId = 1
  const userId = 2
  const clubId = 3

  function createTestQueuedTrack(payload?: Partial<CreateQueuedTrackDto>) {
    const track = trackService.create({
      name: 'Test track',
      album: 'Example Album',
      artists: ['Acme Music'],
      release_year: 2025,
      spotify_id: 'abc123',
    })
    return queueService.createQueuedTrack({
      queued_by: { id: jukeSessionMembership.id },
      track,
      ...(payload ?? {}),
    })
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          Jukebox,
          PlayerInteraction,
          QueuedTrack,
          JukeSession,
          JukeSessionMembership,
          Track,
        ]),
      ],
      providers: [
        AxiosMockProvider,
        MockCacheProvider,
        PlayerService,
        SpotifyService,
        QueueService,
        JukeboxService,
        JukeSessionService,
        TrackService,
      ],
    }).compile()

    service = module.get<PlayerService>(PlayerService)
    queueService = module.get<QueueService>(QueueService)
    jukeboxService = module.get<JukeboxService>(JukeboxService)
    jukeSessionService = module.get<JukeSessionService>(JukeSessionService)
    trackService = module.get<TrackService>(TrackService)

    cache = module.get<Cache>(CACHE_MANAGER)

    jukebox = jukeboxService.create({ club_id: clubId, name: 'Test Jukebox' })
    jukeSession = jukeSessionService.create({ jukebox: { id: jukebox.id } })
    jukeSessionMembership = jukeSessionService.createMembership({
      juke_session: { id: jukeSession.id },
      user_id: userId,
    })
    track = trackService.create({
      name: 'Test track',
      album: 'Example Album',
      artists: ['Acme Music'],
      release_year: 2025,
      spotify_id: 'abc123',
    })

    queuedTrack = queueService.createQueuedTrack({
      queued_by: { id: jukeSessionMembership.id },
      track,
    })

    initialPlayerState = {
      jukebox_id: jukeboxId,
      is_playing: false,
      progress: 3000,
      last_progress_update: new Date(),
      queued_track: plainToInstance(QueuedTrackDto, queuedTrack),
    }
    cache.set(cacheKey, initialPlayerState)
  })

  afterEach(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get player state', async () => {
    const playerState = await service.getPlayerState(1)

    expect(playerState).toBeDefined()
    expect(playerState.jukebox_id).toEqual(initialPlayerState.jukebox_id)
    expect(playerState.progress).toEqual(initialPlayerState.progress)
    expect(playerState.is_playing).toEqual(initialPlayerState.is_playing)
  })

  it('should get player state if not set', async () => {
    cache.set(cacheKey, undefined)
    const playerState = await service.getPlayerState(jukeboxId)

    expect(playerState).toBeDefined()
    expect(playerState.jukebox_id).toEqual(jukeboxId)
    expect(playerState.progress).toEqual(0)
    expect(playerState.is_playing).toBeFalsy()
  })

  it('should set current progress', async () => {
    const newDate = new Date()
    const playerState = await service.setCurrentProgress(jukeboxId, 10, newDate)
    expect(playerState.progress).toEqual(10)
    expect(playerState.last_progress_update).toEqual(newDate)
  })

  it('should add interaction', async () => {
    const playerState = await service.addInteraction(jukeboxId, mockUser, InteractionType.LIKE)
    expect(playerState.queued_track?.likes).toEqual(1)
    expect(playerState.queued_track?.dislikes).toEqual(0)
  })

  it('should show track as playing', async () => {
    cache.set(cacheKey, { ...initialPlayerState, is_playing: false })

    const playerState = await service.setIsPlaying(jukeboxId, true)
    expect(playerState.is_playing).toBeTruthy()
  })

  it('should show track as paused', async () => {
    cache.set(cacheKey, { ...initialPlayerState, is_playing: true })

    const playerState = await service.setIsPlaying(jukeboxId, false)
    expect(playerState.is_playing).toBeFalsy()
  })

  it('should show as paused if already paused', async () => {
    cache.set(cacheKey, { ...initialPlayerState, is_playing: false })

    const playerState = await service.setIsPlaying(jukeboxId, false)
    expect(playerState.is_playing).toBeFalsy()
  })

  it('should show next queued track as playing', async () => {
    const newTrack = createTestQueuedTrack()
    const playerState = await service.setCurrentQueuedTrack(jukeboxId, newTrack)
    expect(playerState.queued_track?.track.id).toEqual(newTrack.id)
  })

  it('should show spotify track as currently playing', async () => {
    const newTrack = createTestQueuedTrack()
    const playerState = await service.setCurrentSpotifyTrack(jukeboxId, newTrack.track)
    expect(playerState.spotify_track).not.toBeNull()
    expect(playerState.spotify_track?.id).toEqual(newTrack.id)
  })
})
