import { Module } from '@nestjs/common'
import { AccountLinkModule } from './account-link/account-link.module'
import { JukeSessionModule } from './juke-session/juke-session.module'
import { JukeSessionService } from './juke-session/juke-session.service'
import { JukeboxController } from './jukebox.controller'
import { JukeboxService } from './jukebox.service'
import { PlayerController } from './player/player.controller'
import { PlayerService } from './player/player.service'
import { QueueController } from './queue/queue.controller'
import { QueueService } from './queue/queue.service'

@Module({
  controllers: [JukeboxController, QueueController, PlayerController],
  providers: [JukeboxService, QueueService, JukeSessionService, PlayerService],
  imports: [AccountLinkModule, JukeSessionModule],
})
export class JukeboxModule {}
