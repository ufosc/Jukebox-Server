import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { AuthInterceptor } from './auth/auth.interceptor'
import { CacheOptions } from './config/cache-options'
import { DatabaseModule } from './config/database.module'
import { JukeboxModule } from './jukebox/jukebox.module'
import { TrackQueueModule } from './jukebox/track-queue/track-queue.module'
import { NetworkModule } from './network/network.module'
import { SpotifyModule } from './spotify/spotify.module'
import { AxiosProvider } from './utils/providers/axios.provider'
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(CacheOptions),
    DatabaseModule,
    NetworkModule,
    SpotifyModule,
    TrackQueueModule,
    JukeboxModule,
  ],
  // controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    AxiosProvider,
    // NetworkService,
    // { provide: APP_INTERCEPTOR, useClass: AuthInterceptor },
  ],
  controllers: [AppController],
})
export class AppModule {}
