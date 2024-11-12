import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NetworkModule } from 'src/network/network.module'
import { NetworkService } from '../network/network.service'
import { AxiosProvider } from '../utils/providers/axios.provider'
import { SpotifyAccount } from './entities/spotify-account.entity'
import { SpotifyAuthService } from './spotify-auth.service'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  imports: [NetworkModule, TypeOrmModule.forFeature([SpotifyAccount])],
  controllers: [SpotifyController],
  providers: [SpotifyAuthService, AxiosProvider, NetworkService, SpotifyService],
  exports: [SpotifyAuthService, SpotifyService],
})
export class SpotifyModule {}
