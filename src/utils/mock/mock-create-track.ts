import type { CreateTrackDto } from 'src/track/dto/track.dto'

export const mockCreateTrack: CreateTrackDto = {
  name: 'Yellow',
  album: 'Parachutes',
  artists: ['Coldplay'],
  release_year: 2000,
  spotify_id: '3AJwUDP919kvQ9QcozQPxg',
  spotify_uri: 'spotify:track:3AJwUDP919kvQ9QcozQPxg',
  duration_ms: 2000,
  is_explicit: false,
  preview_url: 'https://i.scdn.co/image/ab67616d0000b273abcdabcdabcdabcdabcdabcd',
}
