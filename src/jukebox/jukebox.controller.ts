import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { CreateJukeboxDto, UpdateJukeboxDto } from './dto/jukebox.dto'
import { JukeboxService } from './jukebox.service'
import { AuthInterceptor } from 'src/auth/auth.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { TokenGuard } from 'src/guards/token.guard';

@Controller('jukebox/jukeboxes/')
export class JukeboxController {
  constructor(private readonly jukeboxService: JukeboxService) { }

  @Post()
  create(@Body() createJukeboxDto: CreateJukeboxDto) {
    return this.jukeboxService.create(createJukeboxDto)
  }

  @ApiBearerAuth()
  @UseInterceptors(AuthInterceptor)
  @Get()
  findAll(@Query('clubId') clubId: string) {
    return this.jukeboxService.findAll(+clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jukeboxService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJukeboxDto: UpdateJukeboxDto) {
    return this.jukeboxService.update(+id, updateJukeboxDto)
  }

  @UseGuards(TokenGuard, IsAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jukeboxService.remove(+id)
  }
}
