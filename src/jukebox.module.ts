import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppGateway } from 'src/app.gateway'
import { SpotifyModule } from '../spotify/spotify.module'
import { Jukebox, JukeboxLinkAssignment } from './entities/jukebox.entity'
import { JukeboxController } from './jukebox.controller'
import { JukeboxGateway } from './jukebox.gateway'
import { JukeboxService } from './jukebox.service'
import { TrackQueueService } from './track-queue/track-queue.service'
import { TracksModule } from './tracks/tracks.module';

@Module({
  controllers: [JukeboxController],
  providers: [JukeboxService, TrackQueueService, JukeboxGateway, AppGateway],
  imports: [TypeOrmModule.forFeature([Jukebox, JukeboxLinkAssignment]), SpotifyModule, TracksModule],
  exports: [JukeboxService, TrackQueueService],
})
export class JukeboxModule {}
