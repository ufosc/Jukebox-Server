import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Serialize } from 'src/utils'
import { CreateJukeSessionDto, JukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import { CreateJukeSessionMembershipDto, JukeSessionMembershipDto } from './dto/membership.dto'
import { JukeSessionService } from './juke-session.service'
import { AuthInterceptor } from 'src/auth/auth.interceptor'

@Controller(':jukebox_id/juke-session')
export class JukeSessionController {
  constructor(private readonly jukeSessionService: JukeSessionService) { }

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(AuthInterceptor)
  @ApiOperation({ summary: 'Start Juke Session' })
  create(
    @Param('jukebox_id') jukeboxId: string,
    @Body() createJukeSessionDto: CreateJukeSessionDto,
  ) {
    return this.jukeSessionService.create(+jukeboxId, createJukeSessionDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get All Juke Sessions' })
  findAll(@Param('jukebox_id') jukeboxId: string): Promise<JukeSessionDto[]> {
    return this.jukeSessionService.findAll(+jukeboxId)
  }

  @Get('current')
  @ApiOperation({ summary: 'Get Current Juke Session' })
  getCurrentSession(@Param('jukebox_id') jukeboxId: string) {
    return this.jukeSessionService.getCurrentSession(+jukeboxId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Juke Session' })
  findOne(@Param('jukebox_id') jukeboxId: string, @Param('id') id: string) {
    return this.jukeSessionService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Juke Session' })
  update(
    @Param('jukebox_id') jukeboxId: string,
    @Param('id') id: string,
    @Body() body: UpdateJukeSessionDto,
  ) {
    return this.jukeSessionService.update(+jukeboxId, +id, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Juke Session' })
  remove(@Param('jukebox_id') jukeboxId: string, @Param('id') id: string) {
    return this.jukeSessionService.remove(+id)
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End Juke Session' })
  endJukeSession(@Param('jukebox_id') jukeboxId: string, @Param('id') id: string) {
    return this.jukeSessionService.endSession(+jukeboxId, +id)
  }

  @Post(':juke_session_id/members')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Add Juke Session Member' })
  addJukeSessionMember(
    @Param('jukebox_id') jukeboxId: string,
    @Param('juke_session_id') id: string,
    @Body() body: CreateJukeSessionMembershipDto,
  ) {
    return this.jukeSessionService.createMembership(+id, body)
  }

  @Post(':juke_session_id/members/')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Add Juke Session Member With Join Code' })
  addJukeSessionMemberByJoinCode(
    @Param('jukebox_id') jukeboxId: string,
    @Param('juke_session_id') id: string,
    @Query('joinCode') joinCode: string,
    @Body() body: CreateJukeSessionMembershipDto,
  ) {
    return this.jukeSessionService.addJukeSessionMemberByJoinCode(+id, joinCode, body)
  }

  @Get(':juke_session_id/members')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Get Juke Session Members' })
  getJukeSessionMembers(
    @Param('jukebox_id') jukeboxId: string,
    @Param('juke_session_id') jukeSessionId: string,
  ) {
    return this.jukeSessionService.getMemberships(+jukeSessionId)
  }

  @Get(':juke_session_id/members/:id')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Get Juke Session Member' })
  getJukeSessionMember(
    @Param('jukebox_id') jukeboxId: string,
    @Param('juke_session_id') jukeSessionId: string,
    @Param('id') id: string,
  ) {
    return this.jukeSessionService.getMembership(+jukeSessionId, +id)
  }

  @Delete(':juke_session_id/members/:id')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Delete Juke Session Membership' })
  deleteJukeSessionMembership(
    @Param('jukebox_id') jukeboxId: string,
    @Param('juke_session_id') jukeSessionId: string,
    @Param('id') id: string,
  ) {
    return this.jukeSessionService.deleteMembership(+jukeSessionId, +id)
  }
}
