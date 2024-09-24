import { TrackQueueItem } from '../trackQueue'
import { TrackQueue } from '../trackQueue'
import type { Track } from '@spotify/web-api-ts-sdk'


describe('Test TackQue', () => {
  const queue = new TrackQueue("testid");
  queue.push(sometrack)
  it('should push to queue', () => {
    expect(queue.peek()).toBe(sometrack);
    
  });

  // it('should add tracks and pop in order', () => {})
  // it('should not pop track if peeked', () => {})
})


//sample track
const sometrack: Track = {
  id: '1',
  name: 'Test Track',
  duration_ms: 300000,  // The track's duration in milliseconds
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
      upc: '123456789012',  // Example UPC
      ean: '1234567890123',  // Example EAN
      isrc: 'USUM71702776'  // Example ISRC
    },
    external_urls: {
      spotify: 'https://open.spotify.com/album/album-id'
    },
    genres: ['pop'],
    label: 'Test Label',
    popularity: 75
  },
  external_ids: {
    upc: '123456789012',  // Required UPC field
    ean: '1234567890123',  // Required EAN field
    isrc: 'USUM71702776'  // Required ISRC field
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
