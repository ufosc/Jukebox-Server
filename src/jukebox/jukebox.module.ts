import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppGateway } from 'src/app.gateway'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyModule } from '../spotify/spotify.module'
import { Jukebox, JukeboxLinkAssignment } from './entities/jukebox.entity'
import { JukeboxController } from './jukebox.controller'
import { JukeboxGateway } from './jukebox.gateway'
import { JukeboxService } from './jukebox.service'
import { TrackQueueService } from './track-queue/track-queue.service'

@Module({
  controllers: [JukeboxController],
  providers: [JukeboxService, TrackQueueService, JukeboxGateway, AppGateway],
  imports: [
    TypeOrmModule.forFeature([Jukebox, JukeboxLinkAssignment]),
    SpotifyModule,
    NetworkModule,
  ],
  exports: [JukeboxService, TrackQueueService],
})
export class JukeboxModule {}
