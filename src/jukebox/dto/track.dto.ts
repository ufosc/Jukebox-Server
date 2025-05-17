import { ApiProperty } from '@nestjs/swagger'

class TrackImageDto implements ITrackImage {
  url: string
  height?: number | null
  width?: number | null
}

class AlbumInlineDto implements IAlbumInlineDetails {
  id: string
  album_type: 'album' | 'single'
  artists: IArtistInlineDetails[]
  available_markets: string[]
  external_urls?: { spotify: string }
  href: string
  release_date: string
  release_date_precision: 'day'
  total_tracks: number
  name: string
  uri: string
  images: TrackImageDto[]
}

class ArtistInlineDto implements IArtistInlineDetails {
  id: string
  type: 'artist'
  external_urls?: { spotify: string }
  href: string
  name: string
  uri: string
}

export class TrackDetailsDto implements ITrackDetails {
  id: string
  album: AlbumInlineDto

  @ApiProperty()
  artists: ArtistInlineDto[]

  @ApiProperty({ oneOf: [{ type: 'string', enum: ['track', 'episode', 'ad'] }] })
  type: 'track' | 'episode' | 'ad'

  uri: string
  name: string
  duration_ms: number

  disc_number: number
  explicit: boolean
  popularity: number
  preview_url: string | null
  track_number: number
  external_ids?: { isrc: string }
  external_urls?: { spotify: string }
}

export class TrackInteractionDto implements ITrackInteractions {
  likes: number
  dislikes: number
}

export class QueuedTrackDto implements IQueuedTrack {
  track: TrackDetailsDto
  interactions: TrackInteractionDto
  queue_id: string
  recommended_by?: string
  spotify_queued?: boolean
}
