import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JukeboxModule } from 'src/jukebox/jukebox.module'
import { NetworkModule } from 'src/network/network.module'
import { NetworkService } from '../network/network.service'
import { AxiosProvider } from '../utils/providers/axios.provider'
import { SpotifyAccount } from './entities/spotify-account.entity'
import { SpotifyAuthService } from './spotify-auth.service'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  imports: [
    NetworkModule,
    TypeOrmModule.forFeature([SpotifyAccount]),
    forwardRef(() => JukeboxModule), // Prevent circular dependency
  ],
  controllers: [SpotifyController],
  providers: [AxiosProvider, SpotifyAuthService, NetworkService, SpotifyService],
  exports: [SpotifyAuthService, SpotifyService],
})
export class SpotifyModule {}
