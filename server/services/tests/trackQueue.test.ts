import { TrackQueueItem } from '../trackQueue';
import { TrackQueue } from '../trackQueue';
import type { Track } from '@spotify/web-api-ts-sdk';

// describe('TrackQueue Tests', () => {
  let queue: TrackQueue;
  const sometrack: Track = {
    id: '1',
    name: 'Test Track',
    duration_ms: 300000,
    album: {
      id: 'album-id',
      name: 'Test Album',
      album_type: 'album',
      album_group: 'album',
      artists: [],
      available_markets: [],
      href: 'https://api.spotify.com/v1/albums/album-id',
      images: [],
      release_date: '2021-01-01',
      release_date_precision: 'day',
      total_tracks: 10,
      type: 'album',
      uri: 'spotify:album:album-id',
      copyrights: [
        { text: '© 2021 Test Label', type: 'C' },
        { text: '℗ 2021 Test Label', type: 'P' }
      ],
      external_ids: {
        upc: '123456789012',
        ean: '1234567890123',
        isrc: 'USUM71702776'
      },
      external_urls: {
        spotify: 'https://open.spotify.com/album/album-id'
      },
      genres: ['pop'],
      label: 'Test Label',
      popularity: 75
    },
    external_ids: {
      upc: '123456789012',
      ean: '1234567890123',
      isrc: 'USUM71702776'
    },
    popularity: 0,
    artists: [
      {
        id: 'artist1',
        name: 'Artist 1',
        href: '',
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1'
        },
        type: 'artist',
        uri: 'spotify:artist:1'
      }
    ],
    available_markets: [],
    disc_number: 1,
    episode: false,
    explicit: false,
    external_urls: {
      spotify: 'https://open.spotify.com/track/1'
    },
    href: 'https://api.spotify.com/v1/tracks/1',
    is_local: false,
    preview_url: null,
    track: true,
    track_number: 1,
    type: 'track',
    uri: 'spotify:track:1'
  };

describe('Test TackQue', () => {
  const queue = new TrackQueue("testid");
  // queue.push(sometrack)
  it('should push to queue', () => {
    // expect(queue.peek()).toBe(sometrack);
  });

  it('should pop tracks in the correct order', () => {
    queue.push(sometrack);
    const anotherTrack = { ...sometrack, id: '2', name: 'Another Track' };
    queue.push(anotherTrack);

    expect(queue.pop()).toBe(sometrack);
    expect(queue.pop()).toBe(anotherTrack);
  });

  it('should not pop a track if only peeked', () => {
    queue.push(sometrack);
    expect(queue.peek()).toBe(sometrack);
    expect(queue.peek()).toBe(sometrack); // Queue should remain unchanged
    expect(queue.pop()).toBe(sometrack); // Now pop should return the track
  });

  it('should return undefined when popping an empty queue', () => {
    expect(queue.pop()).toBeUndefined();
  });

  it('should return undefined when peeking an empty queue', () => {
    expect(queue.peek()).toBeUndefined();
  });
});
