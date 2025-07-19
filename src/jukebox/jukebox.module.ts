import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpotifyModule } from 'src/spotify/spotify.module'
import { TrackService } from 'src/track/track.service'
import { AccountLinkModule } from './account-link/account-link.module'
import { JukeSession } from './juke-session/entities/juke-session.entity'
import { JukeSessionMembership } from './juke-session/entities/membership.entity'
import { JukeSessionModule } from './juke-session/juke-session.module'
import { JukeSessionService } from './juke-session/juke-session.service'
import { JukeboxController } from './jukebox.controller'
import { JukeboxService } from './jukebox.service'
import { PlayerInteraction } from './player/entity/player-interaction.entity'
import { PlayerController } from './player/player.controller'
import { PlayerService } from './player/player.service'
import { QueuedTrack } from './queue/entities/queued-track.entity'
import { QueueController } from './queue/queue.controller'
import { QueueService } from './queue/queue.service'

@Module({
  imports: [
    AccountLinkModule,
    JukeSessionModule,
    forwardRef(() => SpotifyModule),
    TypeOrmModule.forFeature([PlayerInteraction, QueuedTrack, JukeSession, JukeSessionMembership]),
  ],
  controllers: [JukeboxController, QueueController, PlayerController],
  providers: [JukeboxService, QueueService, JukeSessionService, PlayerService, TrackService],
  exports: [JukeboxService, QueueService, JukeSessionService, PlayerService],
})
export class JukeboxModule {}
