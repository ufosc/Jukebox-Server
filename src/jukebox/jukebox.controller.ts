import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateJukeboxDto, UpdateJukeboxDto } from './dto/jukebox.dto'
import { JukeboxService } from './jukebox.service'

@Controller('jukebox/jukeboxes/')
export class JukeboxController {
  constructor(private readonly jukeboxService: JukeboxService) {}

  @Post()
  create(@Body() createJukeboxDto: CreateJukeboxDto) {
    return this.jukeboxService.create(createJukeboxDto)
  }

  @Get()
  findAll() {
    return this.jukeboxService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jukeboxService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJukeboxDto: UpdateJukeboxDto) {
    return this.jukeboxService.update(+id, updateJukeboxDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jukeboxService.remove(+id)
  }
}
