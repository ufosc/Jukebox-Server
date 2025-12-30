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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { UserDto } from 'src/shared'
import { CurrentUser } from 'src/utils/decorators'
import { Roles } from 'src/utils/decorators/roles.decorator'
import { RolesGuard } from 'src/utils/guards/roles.guard'
import { CreateJukeboxDto, UpdateJukeboxDto } from './dto/jukebox.dto'
import { JukeboxService } from './jukebox.service'

@ApiTags('Jukebox')
@ApiBearerAuth()
@Controller('jukebox/jukeboxes/')
@UseInterceptors(AuthInterceptor)
export class JukeboxController {
  constructor(private readonly jukeboxService: JukeboxService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create a jukebox entity' })
  create(@Body() createJukeboxDto: CreateJukeboxDto) {
    return this.jukeboxService.create(createJukeboxDto)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: '[MEMBER] Find all jukeboxes for a club id' })
  findAll(
    @Query('club_id', new NumberPipe('clubId')) clubId: number,
    @CurrentUser() user: UserDto,
  ) {
    return this.jukeboxService.findAll(clubId, user.token)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get(':jukebox_id')
  @ApiOperation({ summary: '[MEMBER] Find a jukebox by id' })
  findOne(@Param('jukebox_id', new NumberPipe('jukebox_id')) id: number) {
    return this.jukeboxService.findOne(id)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':jukebox_id')
  @ApiOperation({ summary: '[ADMIN] Update a jukebox by id' })
  update(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) id: number,
    @Body() updateJukeboxDto: UpdateJukeboxDto,
  ) {
    return this.jukeboxService.update(id, updateJukeboxDto)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':jukebox_id')
  @ApiOperation({ summary: '[ADMIN] Delete a jukebox by id' })
  remove(@Param('jukebox_id', new NumberPipe('jukebox_id')) id: number) {
    return this.jukeboxService.remove(id)
  }
}
