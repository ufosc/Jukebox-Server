import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateJukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import { JukeSessionService } from './juke-session.service'

@Controller('juke-session')
export class JukeSessionController {
  constructor(private readonly jukeSessionService: JukeSessionService) {}

  @Post()
  create(@Body() createJukeSessionDto: CreateJukeSessionDto) {
    return this.jukeSessionService.create(createJukeSessionDto)
  }

  @Get()
  findAll() {
    return this.jukeSessionService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jukeSessionService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJukeSessionDto: UpdateJukeSessionDto) {
    return this.jukeSessionService.update(+id, updateJukeSessionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jukeSessionService.remove(+id)
  }
}
