import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NetworkModule } from 'src/network/network.module'
import { Jukebox } from '../entities/jukebox.entity'
import { JukeboxService } from '../jukebox.service'
import { JukeSession } from './entities/juke-session.entity'
import { JukeSessionMembership } from './entities/membership.entity'
import { JukeSessionController } from './juke-session.controller'
import { JukeSessionService } from './juke-session.service'

@Module({
  imports: [NetworkModule, TypeOrmModule.forFeature([JukeSession, JukeSessionMembership, Jukebox])],
  controllers: [JukeSessionController],
  providers: [JukeSessionService, JukeboxService],
  exports: [JukeSessionService],
})
export class JukeSessionModule {}
