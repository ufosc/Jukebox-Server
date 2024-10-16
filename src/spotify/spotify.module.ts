import { Module } from '@nestjs/common'
import { NetworkModule } from 'src/network/network.module'
import { NetworkService } from '../network/network.service'
import { AxiosProvider } from '../utils/providers/axios.provider'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  imports: [
    NetworkModule,
    // TypeOrmModule.forFeature([SpotifyLink])
  ],
  controllers: [SpotifyController],
  providers: [SpotifyService, AxiosProvider, NetworkService],
  // imports: [MongooseModule.forFeature([{ name: SpotifyLink.name, schema: SpotifyLinkSchema }])],
  exports: [SpotifyService],
})
export class SpotifyModule {}
