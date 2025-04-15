import { Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Track } from './entities/track.entity'
import { TracksService } from './tracks.service'

@ApiBearerAuth()
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  async create(): Promise<Track> {
    return this.tracksService.create()
  }

  @Get()
  async findAll(): Promise<Track[]> {
    return this.tracksService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Track | null> {
    return this.tracksService.findOne(id)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.tracksService.remove(id)
  }
}
