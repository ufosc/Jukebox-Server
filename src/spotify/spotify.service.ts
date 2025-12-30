import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { MaxInt } from '@spotify/web-api-ts-sdk'
import { JukeboxSearchDto } from 'src/jukebox/dto/jukebox-search.dto'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { SpotifyBaseService } from './spotify-base.service'

export interface ISpotifyService {
  setPlayerDevice(spotifyAuth: SpotifyTokensDto, deviceId: string): Promise<void>
  startPlayback(spotifyAuth: SpotifyTokensDto, deviceId: string): Promise<void>
  pausePlayback(spotifyAuth: SpotifyTokensDto, deviceId: string): Promise<void>
  skipNext(spotifyAuth: SpotifyTokensDto, deviceId: string): Promise<void>
  skipPrevious(spotifyAuth: SpotifyTokensDto, deviceId: string): Promise<void>
  loopPlayback(spotifyAuth: SpotifyTokensDto, deviceId: string): Promise<void>
  playTrack(spotifyAuth: SpotifyTokensDto, deviceId: string, trackUri: string): Promise<void>
}

@Injectable()
export class SpotifyService extends SpotifyBaseService implements ISpotifyService {
  constructor(protected httpService: HttpService) {
    super()
  }

  async getProfile(spotifyAuth: SpotifyTokensDto) {
    const sdk = this.getSdk(spotifyAuth)
    return await sdk.currentUser.profile()
  }

  async getTrack(spotifyAuth: SpotifyTokensDto, trackId: string) {
    const sdk = this.getSdk(spotifyAuth)
    const track = await sdk.tracks.get(trackId)

    return track
  }

  async queueTrack(spotifyAuth: SpotifyTokensDto, track_uri: string) {
    // const sdk = this.getSdk(spotifyAuth)
    // await sdk.player.addItemToPlaybackQueue(track.uri)
    await this.httpService.axiosRef
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

  async setPlayerDevice(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.transferPlayback([deviceId])
  }

  async getQueue(spotifyAuth: SpotifyTokensDto) {
    const sdk = this.getSdk(spotifyAuth)
    return sdk.player.getUsersQueue()
  }

  async searchTracks(
    spotifyAuth: SpotifyTokensDto,
    searchQuery: JukeboxSearchDto,
    limit: MaxInt<50> = 10,
  ) {
    const sdk = this.getSdk(spotifyAuth)
    return sdk.search(
      `${searchQuery.trackQuery} artist:${searchQuery.artistQuery} album:${searchQuery.albumQuery}`,
      ['track'],
      undefined,
      limit,
    )
  }

  async startPlayback(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.startResumePlayback(deviceId)
  }

  async pausePlayback(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.pausePlayback(deviceId)
  }

  async skipNext(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.skipToNext(deviceId)
  }

  async skipPrevious(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.skipToPrevious(deviceId)
  }

  async loopPlayback(spotifyAuth: SpotifyTokensDto, deviceId: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.setRepeatMode('track', deviceId)
  }

  async playTrack(spotifyAuth: SpotifyTokensDto, deviceId: string, trackUri: string) {
    const sdk = this.getSdk(spotifyAuth)
    await sdk.player.startResumePlayback(deviceId, trackUri)
  }
}
