import { Injectable, Logger } from '@nestjs/common'
import { Track } from '@spotify/web-api-ts-sdk'
import { Axios } from 'axios'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { SpotifyBaseService } from './spotify-base.service'

@Injectable()
export class SpotifyService extends SpotifyBaseService {
  constructor(protected axios: Axios) {
    super()
  }

  /**
   * Coerce Track to ITrack
   *
   * The type given in the web-api-ts-sdk is different from
   * the track type given in the web player api. This function
   * will resolve those discrepancies.
   */
  private toITrack(track: Track): ITrack {
    return {
      ...track,
      artists: [...track.artists.map((artist) => ({ ...artist, url: artist.href }))],
      uid: track.id,
      media_type: 'audio',
      track_type: 'audio',
      is_playable: track.is_playable ?? true,
      type: track.type as ITrack['type'],
      linked_from: track.linked_from,
    }
  }

  public async getTrack(spotifyAuth: SpotifyTokensDto, trackId: string): Promise<ITrack> {
    const sdk = this.getSdk(spotifyAuth)
    const track = await sdk.tracks.get(trackId)

    // Coerce to global ITrack type
    return this.toITrack(track)
  }

  public async queueTrack(spotifyAuth: SpotifyTokensDto, track: ITrack) {
    // const sdk = this.getSdk(spotifyAuth)
    // await sdk.player.addItemToPlaybackQueue(track.uri)
    await this.axios
      .post(
        `https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`,
        {},
        {
          headers: { Authorization: `Bearer ${spotifyAuth.access_token}` },
        },
      )
      .catch((err) => {
        Logger.error(`Received error from spotify queue track: ${err.response.data}`)
      })
  }

  public async setPlayerDevice(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.transferPlayback([deviceId])
  }
}
