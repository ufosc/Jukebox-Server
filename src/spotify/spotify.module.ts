import { HttpModule } from '@nestjs/axios'
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { AccountLink } from 'src/jukebox/account-link/entities/account-link.entity'
import { JukeboxModule } from 'src/jukebox/jukebox.module'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyAccount } from './entities/spotify-account.entity'
import { SpotifyAuthService } from './spotify-auth.service'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  imports: [
    NetworkModule,
    HttpModule,
    TypeOrmModule.forFeature([SpotifyAccount, AccountLink]),
    forwardRef(() => JukeboxModule), // Prevent circular dependency
  ],
  controllers: [SpotifyController],
  providers: [SpotifyAuthService, SpotifyService, AccountLinkService],
  exports: [SpotifyAuthService, SpotifyService],
})
export class SpotifyModule {}
