import { Body, Controller, Get, Query } from '@nestjs/common'
import { TrackService } from './track.service'
import { ApiOperation } from '@nestjs/swagger'
import { JukeboxSearchDto } from 'src/jukebox/dto/jukebox-search.dto'

@Controller('track/tracks/')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOperation({ summary: 'Search tracks from the Spotify API' })
  searchTracks(@Query('jukeboxId') jukeboxId: string, @Body() body: JukeboxSearchDto) {
    return this.trackService.searchTracks(+jukeboxId, body)
  }
}
