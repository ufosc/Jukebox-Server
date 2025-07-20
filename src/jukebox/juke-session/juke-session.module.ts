import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JukeSession } from './entities/juke-session.entity'
import { JukeSessionMembership } from './entities/membership.entity'
import { JukeSessionController } from './juke-session.controller'
import { JukeSessionService } from './juke-session.service'

@Module({
  imports: [TypeOrmModule.forFeature([JukeSession, JukeSessionMembership])],
  controllers: [JukeSessionController],
  providers: [JukeSessionService],
  exports: [JukeSessionService]
})
export class JukeSessionModule {}
