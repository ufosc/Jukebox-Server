import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { DatabaseModule } from 'src/config/database.module'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { QueueService } from 'src/jukebox/queue/queue.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AxiosMockProvider, MockCacheProvider, mockUser } from 'src/utils/mock'
import { MockQueuedTracks } from 'src/utils/mock/mock-queued-tracks'
import { PlayerStateDto } from '../dto'
import { InteractionType, PlayerInteraction } from '../entity/player-interaction.entity'
import { PlayerService } from '../player.service'

describe('PlayerService', () => {
  let service: PlayerService
  let cache: Cache
  let initialPlayerState: PlayerStateDto
  let module: TestingModule

  const cacheKey = 'jukebox-1'
  const jukeboxId = 1

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([PlayerInteraction, QueuedTrack])],
      providers: [
        AxiosMockProvider,
        MockCacheProvider,
        PlayerService,
        SpotifyService,
        QueueService,
      ],
    }).compile()

    service = module.get<PlayerService>(PlayerService)
    cache = module.get<Cache>(CACHE_MANAGER)

    initialPlayerState = {
      jukebox_id: jukeboxId,
      is_playing: false,
      progress: 3000,
      last_progress_update: new Date(),
      queued_track: MockQueuedTracks[0],
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
    const newTrack = MockQueuedTracks[1]
    const playerState = await service.setCurrentQueuedTrack(jukeboxId, newTrack)
    expect(playerState.queued_track?.track.id).toEqual(newTrack.id)
  })

  it('should show spotify track as currently playing', async () => {
    const newTrack = MockQueuedTracks[1].track
    const playerState = await service.setCurrentSpotifyTrack(jukeboxId, newTrack)
    expect(playerState.spotify_track).not.toBeNull()
    expect(playerState.spotify_track?.id).toEqual(newTrack.id)
  })
})
