import { Controller, Get } from '@nestjs/common'
import { TrackService } from './track.service'

@Controller('track/tracks/')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  searchTracks() {}
}
