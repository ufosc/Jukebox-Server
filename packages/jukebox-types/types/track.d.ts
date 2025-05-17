declare interface ITrackImage {
  url: string
  height?: number | null
  width?: number | null
}

/**
 * Base fields for a track's artist.
 * This is used in both the Spotify API and the Spotify player.
 */
declare interface IArtistInline {
  name: string
  uri: string
}

/**
 * Base fields for a track's album.
 * This is used in both the Spotify API and the Spotify player.
 */
declare interface IAlbumInline {
  uri: string
  name: string
  images: ITrackImage[]
}

/**
 * Base track information
 * that is included in both the spotify player and spotify api.
 */
declare interface ITrack {
  id: string
  uri: string
  name: string
  type: 'track' | 'episode' | 'ad'
  duration_ms: number
  album: IAlbumInline
  artists: IArtistInline[]
}

/**
 * Track information returned from
 * the Spotify web player.
 */
declare interface IPlayerTrack extends ITrack {
  // id?: string | null
  uid: string
  linked_from: { uri: string | null; id: string | null }
  media_type: 'audio' | 'video'
  track_type: 'audio' | 'video'
  content_type?: 'music'
  is_playable: boolean
  metadata?: any
}

/*
Sample response from player:
{
  "id": "5Pdd4QCr0rREXM03zBM2Eh",
  "uri": "spotify:track:5Pdd4QCr0rREXM03zBM2Eh",
  "type": "track",
  "uid": "38356466633337313163333137613865",
  "linked_from": {
      "uri": null,
      "id": null
  },
  "media_type": "audio",
  "track_type": "audio",
  "content_type": "music",
  "name": "Walk Idiot Walk",
  "duration_ms": 211860,
  "artists": [
      {
          "name": "The Hives",
          "uri": "spotify:artist:4DToQR3aKrHQSSRzSz8Nzt"
      }
  ],
  "album": {
      "uri": "spotify:album:2Qo8MVIOIyrBrqgoCsHCXV",
      "name": "Tyrannosaurus Hives",
      "images": [
          {
              "url": "https://i.scdn.co/image/ab67616d0000b27368fb48c259aa205c9f18117f",
              "height": 640,
              "width": 640
          },
          {
              "url": "https://i.scdn.co/image/ab67616d0000485168fb48c259aa205c9f18117f",
              "height": 64,
              "width": 64
          },
          {
              "url": "https://i.scdn.co/image/ab67616d00001e0268fb48c259aa205c9f18117f",
              "height": 300,
              "width": 300
          }
      ]
  },
  "is_playable": true,
  "metadata": {}
}
*/

/**
 * Artists returned in track information from server.
 */
declare interface IArtistInlineDetails extends IArtistInline {
  id: string
  type: 'artist'
  external_urls?: { spotify: string }
  href: string
}

/**
 * Album fields returned in track information from the server.
 */
declare interface IAlbumInlineDetails extends IAlbumInline {
  id: string
  album_type: 'album' | 'single'
  artists: IArtistInlineDetails[]
  available_markets: string[]
  external_urls?: { spotify: string }
  href: string
  release_date: string
  release_date_precision: 'day'
  total_tracks: number
}

/**
 * Track information returned from the server,
 * includes additional info from the Spotify API.
 */
declare interface ITrackDetails extends ITrack {
  artists: IArtistInlineDetails[]
  album: IAlbumInlineDetails
  disc_number: number
  explicit: boolean
  popularity: number
  preview_url: string | null
  track_number: number
  external_ids?: { isrc: string }
  external_urls?: { spotify: string }
}

/**
Sample response from API:
{
  "album": {
    "album_type": "album",
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/4DToQR3aKrHQSSRzSz8Nzt"
        },
        "href": "https://api.spotify.com/v1/artists/4DToQR3aKrHQSSRzSz8Nzt",
        "id": "4DToQR3aKrHQSSRzSz8Nzt",
        "name": "The Hives",
        "type": "artist",
        "uri": "spotify:artist:4DToQR3aKrHQSSRzSz8Nzt"
      }
    ],
    "available_markets": [
      "AR",
      "AU",
      ...
    ],
    "external_urls": {
      "spotify": "https://open.spotify.com/album/2Qo8MVIOIyrBrqgoCsHCXV"
    },
    "href": "https://api.spotify.com/v1/albums/2Qo8MVIOIyrBrqgoCsHCXV",
    "id": "2Qo8MVIOIyrBrqgoCsHCXV",
    "images": [
      {
        "url": "https://i.scdn.co/image/ab67616d0000b27368fb48c259aa205c9f18117f",
        "width": 640,
        "height": 640
      },
      {
        "url": "https://i.scdn.co/image/ab67616d00001e0268fb48c259aa205c9f18117f",
        "width": 300,
        "height": 300
      },
      {
        "url": "https://i.scdn.co/image/ab67616d0000485168fb48c259aa205c9f18117f",
        "width": 64,
        "height": 64
      }
    ],
    "name": "Tyrannosaurus Hives",
    "release_date": "2004-01-01",
    "release_date_precision": "day",
    "total_tracks": 12,
    "type": "album",
    "uri": "spotify:album:2Qo8MVIOIyrBrqgoCsHCXV"
  },
  "artists": [
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/4DToQR3aKrHQSSRzSz8Nzt"
      },
      "href": "https://api.spotify.com/v1/artists/4DToQR3aKrHQSSRzSz8Nzt",
      "id": "4DToQR3aKrHQSSRzSz8Nzt",
      "name": "The Hives",
      "type": "artist",
      "uri": "spotify:artist:4DToQR3aKrHQSSRzSz8Nzt"
    }
  ],
  "available_markets": [
    "AR",
    "AU",
    ...
  ],
  "disc_number": 1,
  "duration_ms": 211813,
  "explicit": false,
  "external_ids": {
    "isrc": "GBAKW0400379"
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/track/5Pdd4QCr0rREXM03zBM2Eh"
  },
  "href": "https://api.spotify.com/v1/tracks/5Pdd4QCr0rREXM03zBM2Eh",
  "id": "5Pdd4QCr0rREXM03zBM2Eh",
  "is_local": false,
  "name": "Walk Idiot Walk",
  "popularity": 52,
  "preview_url": null,
  "track_number": 3,
  "type": "track",
  "uri": "spotify:track:5Pdd4QCr0rREXM03zBM2Eh"
}
*/

/**
 * How users can interact with tracks in the queue.
 */
declare interface ITrackInteractions {
  likes: number
  dislikes: number
}

/**
 * Information about a track that is queued.
 */
declare interface IQueuedTrack {
  track: ITrackDetails
  queue_id: string
  recommended_by?: string
  spotify_queued?: boolean
  interactions: ITrackInteractions
}
