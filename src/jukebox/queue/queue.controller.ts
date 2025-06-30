import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { TrackService } from 'src/track/track.service'
import { QueueDto, QueuedTrackDto, QueueUpTrackDto, SetQueueOrderDto } from './dto'
import { QueueService } from './queue.service'

@Controller('jukebox/jukesessions/:juke_session_id/queue/')
export class QueueController {
  constructor(
    private queueService: QueueService,
    private trackService: TrackService,
  ) {}

  @Get()
  getQueuedTracks(@Param('juke_session_id') jukeSessionId: string): QueueDto {
    return this.queueService.getQueue(+jukeSessionId)
  }

  @Post()
  async queueUpTrack(
    @Param('juke_session_id') jukeSessionId: string,
    @Body() body: QueueUpTrackDto,
  ): Promise<QueuedTrackDto> {
    const track = await this.trackService.getTrack(body.spotify_track_id)
    return this.queueService.queueTrack(+jukeSessionId, track)
  }

  @Put()
  setQueueOrder(@Param('juke_session_id') jukeSessionId: string, @Body() body: SetQueueOrderDto) {
    return this.queueService.setQueueOrder(+jukeSessionId, body.ordering)
  }

  @Delete()
  clearQueue(@Param('juke_session_id') jukeSessionId: string) {
    return this.queueService.clearQueue(+jukeSessionId)
  }
}
