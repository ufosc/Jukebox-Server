import { Body, Controller, Delete, Get, Param, Patch, Post, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { JukeboxDto } from './dto/jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { JukeboxService } from './jukebox.service'

@ApiTags('jukeboxes')
@Controller('jukebox')
export class JukeboxController {
  constructor(private readonly jukeboxService: JukeboxService) {}

  @Post('jukeboxes')
  create(@Body() createJukeboxDto: CreateJukeboxDto): Promise<JukeboxDto> {
    return this.jukeboxService.create(createJukeboxDto)
  }

  @Get('jukeboxes')
  findAll(): Promise<JukeboxDto[]> {
    return this.jukeboxService.findAll()
  }

  @Get('jukeboxes/:id')
  findOne(@Param('id') id: string): Promise<JukeboxDto> {
    return this.jukeboxService.findOne(id)
  }

  @Patch('jukeboxes/:id')
  update(@Param('id') id: string, @Body() updateJukeboxDto: UpdateJukeboxDto): Promise<JukeboxDto> {
    return this.jukeboxService.update(id, updateJukeboxDto)
  }

  @Delete('jukeboxes/:id')
  remove(@Param('id') id: string): Promise<JukeboxDto> {
    return this.jukeboxService.remove(id)
  }
}
