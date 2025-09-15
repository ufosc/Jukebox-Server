import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { TrackService } from 'src/track/track.service'
import { QueueDto, QueuedTrackDto, QueueUpTrackDto, SetQueueOrderDto } from './dto'
import { QueueService } from './queue.service'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/utils/decorators/roles.decorator'
import { RolesGuard } from 'src/utils/guards/roles.guard'

@ApiTags('Queue')
@ApiBearerAuth()
@Controller('jukebox/:jukebox_id/jukesessions/:juke_session_id/queue/')
export class QueueController {
  constructor(
    private queueService: QueueService,
    private trackService: TrackService,
  ) {}

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: '[MEMBER] Get queued tracks for a juke session' })
  async getQueuedTracks(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
  ): Promise<QueueDto> {
    return await this.queueService.getQueue(jukeSessionId)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Queue a track to a juke session' })
  async queueTrack(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() body: QueueUpTrackDto,
  ): Promise<QueuedTrackDto> {
    const { spotify_track_id, queued_by } = body
    const track = await this.trackService.getTrack(spotify_track_id, jukeboxId)
    return this.queueService.queueTrack(jukeSessionId, { queued_by, track })
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put()
  @ApiOperation({ summary: '[ADMIN] Set queued track order for a juke session' })
  async setQueueOrder(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
    @Body() body: SetQueueOrderDto,
  ): Promise<QueueDto> {
    return await this.queueService.setQueueOrder(jukeSessionId, body.ordering)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete()
  @ApiOperation({ summary: '[ADMIN] Clear the queued tracks for a juke session' })
  async clearQueue(
    @Param('juke_session_id', new NumberPipe('juke_session_id')) jukeSessionId: number,
  ) {
    return this.queueService.clearQueue(jukeSessionId)
  }
}
