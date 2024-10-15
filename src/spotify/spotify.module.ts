import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NetworkService } from '../network/network.service'
import { AxiosProvider } from '../utils/providers/axios.provider'
import { SpotifyLink, SpotifyLinkSchema } from './schemas/spotify-link.schema'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService, AxiosProvider, NetworkService],
  imports: [MongooseModule.forFeature([{ name: SpotifyLink.name, schema: SpotifyLinkSchema }])],
  exports: [SpotifyService]
})
export class SpotifyModule {}
