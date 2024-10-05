import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from './spotify/spotify.module';
import { TrackQueueModule } from './track-queue/track-queue.module';

@Module({
  imports: [SpotifyModule, TrackQueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
