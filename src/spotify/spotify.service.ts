import { Injectable } from '@nestjs/common'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { SpotifyBaseService } from './spotify-base.service'

@Injectable()
export class SpotifyService extends SpotifyBaseService {
  public async getTrack(account: SpotifyTokensDto, trackId: string) {
    const sdk = this.getSdk(account)
    return await sdk.tracks.get(trackId)
  }
}
