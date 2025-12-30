import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyModule } from 'src/spotify/spotify.module'
import { Jukebox } from '../entities/jukebox.entity'
import { JukeboxService } from '../jukebox.service'
import { AccountLinkController } from './account-link.controller'
import { AccountLinkService } from './account-link.service'
import { AccountLink } from './entities/account-link.entity'

@Module({
  imports: [
    NetworkModule,
    SpotifyModule,
    TypeOrmModule.forFeature([AccountLink, SpotifyAccount, Jukebox]),
  ],
  controllers: [AccountLinkController],
  providers: [AccountLinkService, JukeboxService],
  exports: [AccountLinkService],
})
export class AccountLinkModule {}
