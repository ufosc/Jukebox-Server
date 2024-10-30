import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NetworkModule } from 'src/network/network.module'
import { NetworkService } from '../network/network.service'
import { AxiosProvider } from '../utils/providers/axios.provider'
import { SpotifyAccount } from './entities/spotify-account.entity'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  imports: [NetworkModule, TypeOrmModule.forFeature([SpotifyAccount])],
  controllers: [SpotifyController],
  providers: [SpotifyService, AxiosProvider, NetworkService],
  // imports: [MongooseModule.forFeature([{ name: SpotifyLink.name, schema: SpotifyLinkSchema }])],
  exports: [SpotifyService],
})
export class SpotifyModule {}
