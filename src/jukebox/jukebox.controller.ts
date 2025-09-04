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
import { RolesGuard } from 'src/utils/guards/roles.guard'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { Roles } from 'src/utils/decorators/roles.decorator'

@ApiBearerAuth()
@Controller('jukebox/jukeboxes/')
export class JukeboxController {
  constructor(private readonly jukeboxService: JukeboxService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a jukebox entity' })
  create(@Body() createJukeboxDto: CreateJukeboxDto) {
    return this.jukeboxService.create(createJukeboxDto)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @UseInterceptors(AuthInterceptor)
  @Get()
  @ApiOperation({ summary: 'Find all jukeboxes for a club id' })
  findAll(@Query('clubId', new NumberPipe('clubId')) clubId: number) {
    return this.jukeboxService.findAll(clubId)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get(':jukebox_id')
  @ApiOperation({ summary: 'Find a jukebox by id' })
  findOne(@Param('jukebox_id', new NumberPipe('jukebox_id')) id: number) {
    return this.jukeboxService.findOne(id)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':jukebox_id')
  @ApiOperation({ summary: 'Update a jukebox by id' })
  update(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) id: number,
    @Body() updateJukeboxDto: UpdateJukeboxDto,
  ) {
    return this.jukeboxService.update(id, updateJukeboxDto)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':jukebox_id')
  @ApiOperation({ summary: 'Delete a jukebox by id' })
  remove(@Param('jukebox_id', new NumberPipe('jukebox_id')) id: number) {
    return this.jukeboxService.remove(id)
  }
}
