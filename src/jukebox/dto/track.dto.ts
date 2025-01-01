import { ApiProperty } from '@nestjs/swagger'

class SpotifyImageDto implements Spotify.Image {
  height?: number
  url: string
  size?: string
  width?: number
}

class SpotifyAlbumDto implements Spotify.Album {
  name: string
  uri: string
  images: SpotifyImageDto[]
}

class SpotifyEntityDto implements Spotify.Entity {
  name: string
  uri: string
  url: string
}

export class TrackMetaDto implements ITrackMeta {
  @ApiProperty()
  queue_id: string

  @ApiProperty()
  recommended_by?: string

  @ApiProperty()
  spotify_queued?: boolean

  @ApiProperty()
  likes?: number

  @ApiProperty()
  dislikes?: number

  @ApiProperty()
  album: SpotifyAlbumDto

  @ApiProperty()
  artists: SpotifyEntityDto[]

  @ApiProperty()
  duration_ms: number

  @ApiProperty()
  id: string

  @ApiProperty()
  is_playable: boolean

  @ApiProperty()
  name: string

  @ApiProperty()
  uid: string

  @ApiProperty()
  uri: string

  @ApiProperty({ oneOf: [{ type: 'string', enum: ['audio', 'video'] }] })
  media_type: 'audio' | 'video'

  @ApiProperty({ oneOf: [{ type: 'string', enum: ['track', 'episode', 'ad'] }] })
  type: 'track' | 'episode' | 'ad'

  @ApiProperty({ oneOf: [{ type: 'string', enum: ['audio', 'video'] }] })
  track_type: 'audio' | 'video'

  @ApiProperty()
  linked_from: { uri: string | null; id: string | null }
}
