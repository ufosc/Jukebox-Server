import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CreateJukeboxDto, UpdateJukeboxDto } from './dto/jukebox.dto'
import { JukeboxService } from './jukebox.service'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { IsAdminGuard } from 'src/guards/is-admin.guard'
import { TokenGuard } from 'src/guards/token.guard'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'

@Controller('jukebox/jukeboxes/')
export class JukeboxController {
  constructor(private readonly jukeboxService: JukeboxService) {}

  @Post()
  @ApiOperation({ summary: 'Create a jukebox entity' })
  create(@Body() createJukeboxDto: CreateJukeboxDto) {
    return this.jukeboxService.create(createJukeboxDto)
  }

  @ApiBearerAuth()
  @UseInterceptors(AuthInterceptor)
  @Get()
  @ApiOperation({ summary: 'Find all jukeboxes for a club id' })
  findAll(@Query('clubId', new NumberPipe('clubId')) clubId: number) {
    return this.jukeboxService.findAll(clubId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a jukebox by id' })
  findOne(@Param('id', new NumberPipe('id')) id: number) {
    return this.jukeboxService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a jukebox by id' })
  update(
    @Param('id', new NumberPipe('id')) id: number,
    @Body() updateJukeboxDto: UpdateJukeboxDto,
  ) {
    return this.jukeboxService.update(id, updateJukeboxDto)
  }

  @UseGuards(TokenGuard, IsAdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a jukebox by id' })
  remove(@Param('id', new NumberPipe('id')) id: number) {
    return this.jukeboxService.remove(id)
  }
}
