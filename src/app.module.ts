import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { AuthInterceptor } from './auth/auth.interceptor'
import { DatabaseModule } from './config/database.module'
import { JukeboxModule } from './jukebox/jukebox.module'
import { NetworkModule } from './network/network.module'
import { NetworkService } from './network/network.service'
import { SpotifyModule } from './spotify/spotify.module'
import { TrackQueueModule } from './track-queue/track-queue.module'
import { AxiosProvider } from './utils/providers/axios.provider'

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MongooseModule.forRoot(MONGO_URI),
    DatabaseModule,
    SpotifyModule,
    TrackQueueModule,
    JukeboxModule,
    NetworkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    AxiosProvider,
    NetworkService,
    { provide: APP_INTERCEPTOR, useClass: AuthInterceptor },
  ],
})
export class AppModule {}
