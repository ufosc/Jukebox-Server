import { Module } from '@nestjs/common'
import { TrackQueueService } from './track-queue.service'

@Module({
  providers: [TrackQueueService],
})
export class TrackQueueModule {}
