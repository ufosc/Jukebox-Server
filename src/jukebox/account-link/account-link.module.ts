import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { AxiosProvider } from 'src/utils/mock'
import { AccountLinkController } from './account-link.controller'
import { AccountLinkService } from './account-link.service'
import { AccountLink } from './entities/account-link.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AccountLink, SpotifyAccount])],
  controllers: [AccountLinkController],
  providers: [AxiosProvider, AccountLinkService, SpotifyAuthService],
  exports: [AccountLinkService],
})
export class AccountLinkModule {}
