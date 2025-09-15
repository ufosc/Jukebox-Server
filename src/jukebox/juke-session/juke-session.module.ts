import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JukeSession } from './entities/juke-session.entity'
import { JukeSessionMembership } from './entities/membership.entity'
import { JukeSessionController } from './juke-session.controller'
import { JukeSessionService } from './juke-session.service'
import { NetworkService } from 'src/network/network.service'
import { AxiosProvider } from 'src/utils/mock'
import { JukeboxService } from '../jukebox.service'
import { Jukebox } from '../entities/jukebox.entity'

@Module({
  imports: [TypeOrmModule.forFeature([JukeSession, JukeSessionMembership, Jukebox])],
  controllers: [JukeSessionController],
  providers: [JukeSessionService, NetworkService, AxiosProvider, JukeboxService],
  exports: [JukeSessionService],
})
export class JukeSessionModule {}
