import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Serialize } from 'src/utils'
import { CreateJukeSessionDto, JukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import { CreateJukeSessionMembershipDto, JukeSessionMembershipDto } from './dto/membership.dto'
import { JukeSessionService } from './juke-session.service'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { Roles } from 'src/utils/decorators/roles.decorator'
import { RolesGuard } from 'src/utils/guards/roles.guard'

@ApiTags('JukeSession')
@ApiBearerAuth()
@Controller('jukebox/jukeboxes/:jukebox_id/juke-session')
export class JukeSessionController {
  constructor(private readonly jukeSessionService: JukeSessionService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create/Start juke session' })
  create(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() createJukeSessionDto: CreateJukeSessionDto,
  ) {
    return this.jukeSessionService.create(jukeboxId, createJukeSessionDto)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: '[ADMIN] Get all juke sessions for a jukebox' })
  findAll(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
  ): Promise<JukeSessionDto[]> {
    return this.jukeSessionService.findAll(jukeboxId)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get('current')
  @ApiOperation({ summary: '[MEMBER] Get current juke session for a jukebox' })
  getCurrentSession(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.jukeSessionService.getCurrentSession(jukeboxId)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: '[MEMBER] Get a juke session' })
  findOne(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('id', new NumberPipe('id')) id: number,
  ) {
    return this.jukeSessionService.findOne(id)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a juke session' })
  update(
    @Param('id', new NumberPipe('id')) id: number,
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() body: UpdateJukeSessionDto,
  ) {
    return this.jukeSessionService.update(id, body)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: '[ADMIN] Delete a juke session' })
  remove(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('id', new NumberPipe('id')) id: number,
  ) {
    return this.jukeSessionService.remove(id)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post(':id/members/')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: '[ADMIN] Add juke session member' })
  addJukeSessionMember(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('id', new NumberPipe('id')) id: number,
    @Body() body: CreateJukeSessionMembershipDto,
  ) {
    return this.jukeSessionService.createMembership(id, body)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Post(':id/members/code')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: '[MEMBER] Add juke session member by join code' })
  addJukeSessionMemberByJoinCode(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Query('joinCode') joinCode: string,
    @Body() body: CreateJukeSessionMembershipDto,
  ) {
    return this.jukeSessionService.addJukeSessionMemberByJoinCode(joinCode, body)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get(':id/members')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({
    summary: '[MEMBER] (PAGINATED: 0-indexed) Get members/memberships of a juke session',
  })
  getJukeSessionMembers(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('id', new NumberPipe('id')) id: number,
    @Query('page', new NumberPipe('page')) page: number = 0,
    @Query('rows', new NumberPipe('rows')) rows: number = 7,
  ) {
    return this.jukeSessionService.getMemberships(id, page, rows)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get(':id/members/:membership_id')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: '[MEMBER] Get member/membership for a juke session' })
  getJukeSessionMember(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('membership_id', new NumberPipe('membership_id')) membershipId: number,
  ) {
    return this.jukeSessionService.getMembership(membershipId)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id/members/:membership_id')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: '[ADMIN] Delete member/membership for a juke session' })
  deleteJukeSessionMembership(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('membership_id', new NumberPipe('membership_id')) membershipId: number,
  ) {
    return this.jukeSessionService.deleteMembership(membershipId)
  }
}
