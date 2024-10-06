import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { MONGO_URI } from './config'
import { SpotifyModule } from './spotify/spotify.module'
import { TrackQueueModule } from './track-queue/track-queue.module'
import { JukeboxModule } from './jukebox/jukebox.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MONGO_URI),
    SpotifyModule,
    TrackQueueModule,
    JukeboxModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
