import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { SpotifyModule } from 'src/spotify/spotify.module'
import { SpotifyService } from 'src/spotify/spotify.service'
import { Track } from './entities/track.entity'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'

@Module({
  imports: [
    NetworkModule,
    SpotifyModule,
    TypeOrmModule.forFeature([Track, AccountLink, Jukebox, SpotifyAccount]),
  ],
  controllers: [TrackController],
  providers: [TrackService, AccountLinkService, JukeboxService],

  exports: [TrackService],
})
export class TrackModule {}
