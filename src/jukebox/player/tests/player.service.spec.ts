import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import type { Cache } from 'cache-manager'
import { plainToInstance } from 'class-transformer'
import { DatabaseModule } from 'src/config/database.module'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import type { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import type { JukeSessionDto } from 'src/jukebox/juke-session/dto/juke-session.dto'
import type { JukeSessionMembershipDto } from 'src/jukebox/juke-session/dto/membership.dto'
import { JukeSession } from 'src/jukebox/juke-session/entities/juke-session.entity'
import { JukeSessionMembership } from 'src/jukebox/juke-session/entities/membership.entity'
import { JukeSessionService } from 'src/jukebox/juke-session/juke-session.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { QueuedTrackDto } from 'src/jukebox/queue/dto'
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
import type { PlayerStateDto } from '../dto'
import { InteractionType, PlayerInteraction } from '../entity/player-interaction.entity'
import { PlayerService } from '../player.service'

describe('PlayerService', () => {
  let service: PlayerService
  let cache: Cache
  let initialPlayerState: PlayerStateDto
  let module: TestingModule
  let queueService: QueueService
  let jukeboxService: JukeboxService
  let jukeSessionService: JukeSessionService
  let trackService: TrackService

  let queuedTrack: QueuedTrackDto
  let jukebox: JukeboxDto
  let jukeSession: JukeSessionDto
  let jukeSessionMembership: JukeSessionMembershipDto
  let track: TrackDto

  const cacheKey = 'jukebox-1'
  const jukeboxId = 1
  const userId = 2
  const clubId = 3

  beforeAll(() => {
    jest.spyOn(JukeSessionService.prototype, 'generateQrCode').mockResolvedValue('')
  })

  const createTestQueuedTrack = async () =>
    await queueService.createQueuedTrack(jukeSession.id, {
      queued_by: { id: jukeSessionMembership.id },
      track,
    })

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
          AccountLink,
          SpotifyAccount,
        ]),
      ],
      providers: [
        MockCacheProvider,
        PlayerService,
        SpotifyService,
        QueueService,
        JukeboxService,
        NetworkService,
        JukeSessionService,
        TrackService,
        AccountLinkService,
        SpotifyService,
        SpotifyAuthService,
        { provide: HttpService, useValue: {} },
      ],
    }).compile()

    service = module.get<PlayerService>(PlayerService)
    queueService = module.get<QueueService>(QueueService)
    jukeboxService = module.get<JukeboxService>(JukeboxService)
    jukeSessionService = module.get<JukeSessionService>(JukeSessionService)
    trackService = module.get<TrackService>(TrackService)

    cache = module.get<Cache>(CACHE_MANAGER)

    jukebox = await jukeboxService.create({ club_id: clubId, name: 'Test Jukebox' })
    jukeSession = await jukeSessionService.create(
      jukebox.id,
      {
        end_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 2),
      },
      mockUser.token,
    )
    jukeSessionMembership = await jukeSessionService.createMembership(jukeSession.id, {
      user_id: userId,
    })
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

    queuedTrack = await createTestQueuedTrack()

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
    const datasource = module.get<DataSource>(DataSource)
    await datasource.dropDatabase()
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
    const newTrack = await createTestQueuedTrack()
    const playerState = await service.setCurrentQueuedTrack(jukeboxId, newTrack)
    expect(playerState.queued_track?.track.id).toEqual(newTrack.track.id)
  })

  it('should show spotify track as currently playing', async () => {
    const newTrack = await createTestQueuedTrack()
    const playerState = await service.setCurrentSpotifyTrack(jukeboxId, newTrack.track)
    expect(playerState.spotify_track).not.toBeNull()
    expect(playerState.spotify_track?.id).toEqual(newTrack.track.id)
  })
})
