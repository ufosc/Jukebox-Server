import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NetworkModule } from 'src/network/network.module'
import { SpotifyModule } from '../spotify/spotify.module'
import { TrackModule } from '../track/track.module'
import { AccountLinkModule } from './account-link/account-link.module'
import { Jukebox } from './entities/jukebox.entity'
import { JukeSessionModule } from './juke-session/juke-session.module'
import { JukeboxController } from './jukebox.controller'
import { JukeboxGateway } from './jukebox.gateway'
import { JukeboxService } from './jukebox.service'
import { PlayerInteraction } from './player/entity/player-interaction.entity'
import { PlayerController } from './player/player.controller'
import { PlayerService } from './player/player.service'
import { QueuedTrack } from './queue/entities/queued-track.entity'
import { QueueController } from './queue/queue.controller'
import { QueueService } from './queue/queue.service'
import { HttpModule, HttpService } from '@nestjs/axios'

@Module({
  imports: [
    AccountLinkModule,
    JukeSessionModule,
    TrackModule,
    NetworkModule,
    HttpModule,
    forwardRef(() => SpotifyModule),
    TypeOrmModule.forFeature([Jukebox, PlayerInteraction, QueuedTrack]),
  ],
  controllers: [JukeboxController, QueueController, PlayerController],
  providers: [JukeboxService, QueueService, PlayerService, JukeboxGateway],
  exports: [JukeboxService, QueueService, PlayerService, JukeSessionModule],
})
export class JukeboxModule {}
