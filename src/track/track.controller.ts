import { Body, Controller, Get, NotImplementedException, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JukeboxSearchDto } from 'src/jukebox/dto/jukebox-search.dto'
import { Roles } from 'src/utils/decorators/roles.decorator'
import { RolesGuard } from 'src/utils/guards/roles.guard'
import { TrackService } from './track.service'

@ApiTags('Track')
@ApiBearerAuth()
@Controller('track/tracks/')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: '[MEMBER] Search tracks from the Spotify API' })
  searchTracks(@Query('jukeboxId') jukeboxId: string, @Body() body: JukeboxSearchDto) {
    // return this.trackService.searchTracks(+jukeboxId, body)
    throw new NotImplementedException()
  }
}
