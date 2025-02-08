import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
