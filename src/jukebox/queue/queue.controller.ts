import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { TrackService } from 'src/track/track.service'
import { QueueDto, QueuedTrackDto, QueueUpTrackDto, SetQueueOrderDto } from './dto'
import { QueueService } from './queue.service'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'

@Controller('jukebox/jukesessions/:juke_session_id/queue/')
export class QueueController {
  constructor(
    private queueService: QueueService,
    private trackService: TrackService,
  ) {}

  @Get()
  async getQueuedTracks(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
  ): Promise<QueueDto> {
    return await this.queueService.getQueue(jukeSessionId)
  }

  @Post(':jukebox_id')
  async queueTrack(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() body: QueueUpTrackDto,
  ): Promise<QueuedTrackDto> {
    const { spotify_track_id, queued_by } = body
    const track = await this.trackService.getTrack(spotify_track_id, jukeboxId)
    return this.queueService.queueTrack(jukeSessionId, { queued_by, track })
  }

  @Put()
  async setQueueOrder(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
    @Body() body: SetQueueOrderDto,
  ): Promise<QueueDto> {
    return await this.queueService.setQueueOrder(jukeSessionId, body.ordering)
  }

  @Delete()
  async clearQueue(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
  ) {
    return this.queueService.clearQueue(jukeSessionId)
  }
}
