import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Track } from './entities/track.entity'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AxiosProvider } from 'src/utils/mock'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Track, AccountLink])],
  controllers: [TrackController],
  providers: [AxiosProvider, TrackService, SpotifyService, AccountLinkService],
  exports: [TrackService]
})
export class TrackModule { }
