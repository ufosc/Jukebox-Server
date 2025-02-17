import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackQueueService } from '../track-queue.service';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

const mockCacheManager = {
  get: jest.fn().mockResolvedValue([]),
  set: jest.fn().mockResolvedValue(undefined),
};

describe('TrackQueueService', () => {
  let service: TrackQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackQueueService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<TrackQueueService>(TrackQueueService);
  });

  const jukeboxId = 1;

  const track: ITrackDetails = {
    id: '123',
    name: 'Test Track',
    duration_ms: 300000,
    album: {
      id: 'album-id',
      name: 'Test Album',
      album_type: 'album',
      artists: [],
      available_markets: [],
      href: 'https://api.spotify.com/v1/albums/album-id',
      images: [],
      release_date: '2021-01-01',
      release_date_precision: 'day',
      total_tracks: 10,
      uri: 'spotify:album:album-id',
    },
    artists: [
      {
        id: 'artist1',
        name: 'Artist 1',
        href: '',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1',
        },
        type: 'artist',
        uri: 'spotify:artist:1',
      },
    ],
    external_urls: {
      spotify: 'https://open.spotify.com/track/123',
    },
    popularity: 50,
    explicit: false,
    track_number: 1,
    type: 'track',
    uri: 'spotify:track:123',
    disc_number: 1,
    preview_url: null,
    external_ids: { isrc: 'USUM71702776' },
  };

  it('should queue a track', async () => {
    const result = await service.queueTrack(jukeboxId, track);
    expect(result).toHaveProperty('queue_id');
    expect(result.queue_id).toBeDefined();
    expect(mockCacheManager.set).toHaveBeenCalled();
  });

  it('should pop a track from the queue', async () => {
    mockCacheManager.get.mockResolvedValueOnce([{ track, queue_id: randomUUID() }]);
    const result = await service.popTrack(jukeboxId);
    expect(result).toBeDefined();
    expect(result?.track.id).toBe(track.id);
    expect(mockCacheManager.set).toHaveBeenCalled();
  });

  it('should return the next track without removing it (peek)', async () => {
    mockCacheManager.get.mockResolvedValueOnce([{ track, queue_id: randomUUID() }]);
    const result = await service.peekNextTrack(jukeboxId);
    expect(result).toBeDefined();
    expect(result?.track.id).toBe(track.id);
  });

  it('should check if the queue is empty', async () => {
    mockCacheManager.get.mockResolvedValueOnce([]);
    const result = await service.queueIsEmpty(jukeboxId);
    expect(result).toBe(true);
  });

  it('should check if the queue is not empty', async () => {
    mockCacheManager.get.mockResolvedValueOnce([{ track, queue_id: randomUUID() }]);
    const result = await service.queueIsEmpty(jukeboxId);
    expect(result).toBe(false);
  });

  it('should clear the queue', async () => {
    await service.clearQueue(jukeboxId);
    expect(mockCacheManager.set).toHaveBeenCalledWith('queue-1', [], expect.any(Number));
  });

  it('should handle empty queue when popping track', async () => {
    mockCacheManager.get.mockResolvedValueOnce([]);
    const result = await service.popTrack(jukeboxId);
    expect(result).toBeNull();
  });

  it('should throw an error if queue retrieval fails', async () => {
    mockCacheManager.get.mockRejectedValueOnce(new Error('Cache error'));
    await expect(service.popTrack(jukeboxId)).rejects.toThrow('Cache error');
  });

  it('should throw NotFoundException if track queue is not found', async () => {
    mockCacheManager.get.mockResolvedValueOnce(null);
    await expect(service.peekNextTrack(jukeboxId)).rejects.toThrow(NotFoundException);
  });

  it('should queue multiple tracks and maintain order', async () => {
    const track2: ITrackDetails = { ...track, id: '456', name: 'Second Track' };
    mockCacheManager.get.mockResolvedValueOnce([]);
    await service.queueTrack(jukeboxId, track);
    await service.queueTrack(jukeboxId, track2);
    mockCacheManager.get.mockResolvedValueOnce([
      { track, queue_id: randomUUID() },
      { track: track2, queue_id: randomUUID() },
    ]);
    const result = await service.peekNextTrack(jukeboxId);
    expect(result?.track.id).toBe(track.id);
  });

  it('should not allow duplicate tracks in the queue', async () => {
    mockCacheManager.get.mockResolvedValueOnce([{ track, queue_id: randomUUID() }]);
    await service.queueTrack(jukeboxId, track);
    expect(mockCacheManager.set).toHaveBeenCalledTimes(1);
  });

  it('should return null when peeking an empty queue', async () => {
    mockCacheManager.get.mockResolvedValueOnce([]);
    const result = await service.peekNextTrack(jukeboxId);
    expect(result).toBeNull();
  });

  it('should return null when trying to pop from a queue that was just cleared', async () => {
    mockCacheManager.get.mockResolvedValueOnce([{ track, queue_id: randomUUID() }]);
    await service.clearQueue(jukeboxId);
    mockCacheManager.get.mockResolvedValueOnce([]);
    const result = await service.popTrack(jukeboxId);
    expect(result).toBeNull();
  });
});
