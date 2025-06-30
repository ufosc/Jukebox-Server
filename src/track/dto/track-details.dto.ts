/**
 * Image details returned from Spotify.
 */
export class TrackImageDto {
  url: string
  height?: number | null
  width?: number | null
}

/**
 * Artist information returned from Spotify.
 */
export class ArtistInlineDetailsDto {
  name: string
  uri: string
  id: string
  type: 'artist'
  external_urls?: { spotify: string }
  href: string
}

/**
 * Album information returned from spotify.
 */
export class AlbumInlineDetailsDto {
  id: string
  uri: string
  name: string
  images: TrackImageDto[]
  album_type: 'album' | 'single'
  artists: ArtistInlineDetailsDto[]
  available_markets: string[]
  external_urls?: { spotify: string }
  href: string
  release_date: string
  release_date_precision: 'day'
  total_tracks: number
}

/**
 * Track information returned from Spotify.
 */
export class TrackDetailsDto {
  id: string
  uri: string
  name: string
  type: 'track' | 'episode' | 'ad'
  duration_ms: number
  artists: ArtistInlineDetailsDto[]
  album: AlbumInlineDetailsDto
  disc_number: number
  explicit: boolean
  popularity: number
  preview_url: string | null
  track_number: number
  external_ids?: { isrc: string }
  external_urls?: { spotify: string }
}
