import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkService } from 'src/network/network.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AxiosProvider } from 'src/utils/mock'
import { Track } from './entities/track.entity'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'

@Module({
  imports: [TypeOrmModule.forFeature([Track, AccountLink, Jukebox, SpotifyAccount])],
  controllers: [TrackController],
  providers: [
    AxiosProvider,
    NetworkService,
    TrackService,
    SpotifyService,
    SpotifyAuthService,
    AccountLinkService,
    JukeboxService,
  ],

  exports: [TrackService],
})
export class TrackModule {}
