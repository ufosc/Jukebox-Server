import type { Track } from '@spotify/web-api-ts-sdk'

export const mockTrackDetails: Track = {
  id: '1',
  name: 'Yellow',
  duration_ms: 269000,
  uri: 'spotify:track:3AJwUDP919kvQ9QcozQPxg',
  type: 'track',
  artists: [
    {
      id: '4gzpq5DPGxSnKTe4SA8HAU',
      name: 'Coldplay',
      external_urls: { spotify: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU' },
    } as Track['artists'][number],
  ],
  album: {
    id: '4aawyAB9vmqN3uQ7FjRGTy',
    name: 'Parachutes',
    release_date: '2000-07-10',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273abcdabcdabcdabcdabcdabcd',
        width: 640,
        height: 640,
      },
    ],
    external_urls: { spotify: 'https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy' },
  } as Track['album'],
  disc_number: 1,
  explicit: false,
  popularity: 78,
  preview_url: 'https://p.scdn.co/mp3-preview/abcdefabcdefabcdefabcdef',
  track_number: 5,
  external_ids: {
    isrc: 'GBAYE0000598',
    upc: '',
    ean: '',
  },
  external_urls: { spotify: 'https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg' },
  available_markets: [],
  episode: false,
  href: '',
  is_local: false,
  track: true,
}
