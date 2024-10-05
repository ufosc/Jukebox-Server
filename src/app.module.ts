import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from './spotify/spotify.module';
import { TrackQueueModule } from './track-queue/track-queue.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [SpotifyModule, TrackQueueModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
