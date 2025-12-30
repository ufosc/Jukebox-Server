import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { CacheOptions } from './config/cache-options'
import { DatabaseModule } from './config/database.module'
import { JukeboxModule } from './jukebox/jukebox.module'
import { NetworkModule } from './network/network.module'
import { SpotifyModule } from './spotify/spotify.module'
import { TrackModule } from './track/track.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(CacheOptions),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    DatabaseModule,
    NetworkModule,
    SpotifyModule,
    JukeboxModule,
    TrackModule,
  ],
  providers: [AppService, AppGateway],
  controllers: [AppController],
})
export class AppModule {}
