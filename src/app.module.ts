import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { SpotifyModule } from './spotify/spotify.module'
import { TrackQueueModule } from './track-queue/track-queue.module'

@Module({
  imports: [ConfigModule.forRoot(), SpotifyModule, TrackQueueModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
