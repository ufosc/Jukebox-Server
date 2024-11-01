import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpotifyModule } from '../spotify/spotify.module'
import { Jukebox, JukeboxLinkAssignment } from './entities/jukebox.entity'
import { JukeboxController } from './jukebox.controller'
import { JukeboxService } from './jukebox.service'
import { TrackQueueService } from './track-queue/track-queue.service'

@Module({
  controllers: [JukeboxController],
  providers: [JukeboxService, TrackQueueService],
  imports: [
    TypeOrmModule.forFeature([Jukebox, JukeboxLinkAssignment]),
    SpotifyModule,
  ],
  exports: [JukeboxService, TrackQueueService],
})
export class JukeboxModule {}
