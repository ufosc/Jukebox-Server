import { SpotifyTokensDto } from 'src/spotify/dto'
import { ISpotifyService, SpotifyService } from 'src/spotify/spotify.service'

class MockSpotifyService implements ISpotifyService {
  async setPlayerDevice(spotifyAuth: SpotifyTokensDto, deviceId: string) {}
  async startPlayback(spotifyAuth: SpotifyTokensDto, deviceId: string) {}
  async pausePlayback(spotifyAuth: SpotifyTokensDto, deviceId: string) {}
  async skipNext(spotifyAuth: SpotifyTokensDto, deviceId: string) {}
  async skipPrevious(spotifyAuth: SpotifyTokensDto, deviceId: string) {}
  async loopPlayback(spotifyAuth: SpotifyTokensDto, deviceId: string) {}
  async playTrack(spotifyAuth: SpotifyTokensDto, deviceId: string, trackUri: string) {}
}

export const MockSpotifyServiceProvider = {
  provide: SpotifyService,
  useValue: new MockSpotifyService(),
}
