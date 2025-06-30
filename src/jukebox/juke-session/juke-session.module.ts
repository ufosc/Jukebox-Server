import { Module } from '@nestjs/common';
import { JukeSessionService } from './juke-session.service';
import { JukeSessionController } from './juke-session.controller';

@Module({
  controllers: [JukeSessionController],
  providers: [JukeSessionService],
})
export class JukeSessionModule {}
