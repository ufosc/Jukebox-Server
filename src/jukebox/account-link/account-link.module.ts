import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NetworkService } from 'src/network/network.service'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { AxiosProvider } from 'src/utils/mock'
import { Jukebox } from '../entities/jukebox.entity'
import { JukeboxService } from '../jukebox.service'
import { AccountLinkController } from './account-link.controller'
import { AccountLinkService } from './account-link.service'
import { AccountLink } from './entities/account-link.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AccountLink, SpotifyAccount, Jukebox])],
  controllers: [AccountLinkController],
  providers: [
    AccountLinkService,
    SpotifyAuthService,
    JukeboxService,
    NetworkService,
    AxiosProvider,
  ],
  exports: [AccountLinkService],
})
export class AccountLinkModule {}
