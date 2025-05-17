import { Injectable, Logger } from '@nestjs/common'
import { Axios } from 'axios'
import { JukeboxSearchDto } from 'src/jukebox/dto/jukebox-search.dto'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { SpotifyBaseService } from './spotify-base.service'

@Injectable()
export class SpotifyService extends SpotifyBaseService {
  constructor(protected axios: Axios) {
    super()
  }

  public async getProfile(spotifyAuth: SpotifyTokensDto) {
    const sdk = this.getSdk(spotifyAuth)
    return await sdk.currentUser.profile()
  }

  public async getTrack(spotifyAuth: SpotifyTokensDto, trackId: string): Promise<ITrackDetails> {
    const sdk = this.getSdk(spotifyAuth)
    const track = await sdk.tracks.get(trackId)

    return track as ITrackDetails
  }

  public async queueTrack(spotifyAuth: SpotifyTokensDto, track_uri: string) {
    // const sdk = this.getSdk(spotifyAuth)
    // await sdk.player.addItemToPlaybackQueue(track.uri)
    await this.axios
      .post(
        `https://api.spotify.com/v1/me/player/queue?uri=${track_uri}`,
        {},
        {
          headers: { Authorization: `Bearer ${spotifyAuth.access_token}` },
        },
      )
      .catch((err) => {
        Logger.error('Received error from spotify queue track:')
        console.log(err.response.data)
        Logger.error(err)
      })
  }

  public async setPlayerDevice(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.transferPlayback([deviceId])
  }

  public async getQueue(spotifyAuth: SpotifyTokensDto) {
    const sdk = this.getSdk(spotifyAuth)
    return sdk.player.getUsersQueue()
  }

  public async searchTracks(spotifyAuth: SpotifyTokensDto, searchQuery: JukeboxSearchDto) {
    const sdk = this.getSdk(spotifyAuth)
    return sdk.search(
      `${searchQuery.trackQuery} artist:${searchQuery.artistQuery} album:${searchQuery.albumQuery}`,
      ['track'],
    )
  }
}
