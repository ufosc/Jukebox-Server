import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpotifyModule } from 'src/spotify/spotify.module'
import { TrackService } from 'src/track/track.service'
import { AccountLinkModule } from './account-link/account-link.module'
import { JukeSessionModule } from './juke-session/juke-session.module'
import { JukeboxController } from './jukebox.controller'
import { JukeboxService } from './jukebox.service'
import { PlayerInteraction } from './player/entity/player-interaction.entity'
import { PlayerController } from './player/player.controller'
import { PlayerService } from './player/player.service'
import { QueuedTrack } from './queue/entities/queued-track.entity'
import { QueueController } from './queue/queue.controller'
import { QueueService } from './queue/queue.service'
import { Jukebox } from './entities/jukebox.entity'
import { TrackModule } from 'src/track/track.module'
import { NetworkService } from 'src/network/network.service'
import { AxiosProvider } from 'src/utils/mock'

@Module({
  imports: [
    AccountLinkModule,
    JukeSessionModule,
    TrackModule,
    forwardRef(() => SpotifyModule),
    TypeOrmModule.forFeature([Jukebox, PlayerInteraction, QueuedTrack]),
  ],
  controllers: [JukeboxController, QueueController, PlayerController],
  providers: [AxiosProvider, JukeboxService, QueueService, PlayerService, NetworkService],
  exports: [JukeboxService, QueueService, PlayerService, JukeSessionModule],
})
export class JukeboxModule { }
