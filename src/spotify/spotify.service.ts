import { Injectable } from '@nestjs/common'
import { Track } from '@spotify/web-api-ts-sdk'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { SpotifyBaseService } from './spotify-base.service'

@Injectable()
export class SpotifyService extends SpotifyBaseService {
  public async getTrack(spotifyAuth: SpotifyTokensDto, trackId: string) {
    const sdk = this.getSdk(spotifyAuth)
    return await sdk.tracks.get(trackId)
  }

  public async queueTrack(spotifyAuth: SpotifyTokensDto, track: Track) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.addItemToPlaybackQueue(track.uri)
  }

  public async setPlayerDevice(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.transferPlayback([deviceId])
  }
}
