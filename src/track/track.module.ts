import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Track } from './entities/track.entity'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AxiosProvider } from 'src/utils/mock'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { NetworkService } from 'src/network/network.service'

@Module({
  imports: [TypeOrmModule.forFeature([Track, AccountLink, Jukebox])],
  controllers: [TrackController],
  providers: [
    AxiosProvider,
    NetworkService,
    TrackService,
    SpotifyService,
    AccountLinkService,
    JukeboxService,
  ],
  exports: [TrackService],
})
export class TrackModule {}
