import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Serialize } from 'src/utils';
import { CreateJukeSessionDto, JukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto';
import { CreateJukeSessionMembershipDto, JukeSessionMembershipDto } from './dto/membership.dto';
import { JukeSessionService } from './juke-session.service';
import { AuthInterceptor } from 'src/auth/auth.interceptor';
import { NumberPipe } from 'src/pipes/int-pipe.pipe';

@Controller(':jukebox_id/juke-session')
export class JukeSessionController {
  constructor(private readonly jukeSessionService: JukeSessionService) { }

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(AuthInterceptor)
  @ApiOperation({ summary: 'Start Juke Session' })
  create(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() createJukeSessionDto: CreateJukeSessionDto,
  ) {
    return this.jukeSessionService.create(jukeboxId, createJukeSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Juke Sessions' })
  findAll(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number): Promise<JukeSessionDto[]> {
    return this.jukeSessionService.findAll(jukeboxId);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get Current Juke Session' })
  getCurrentSession(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.jukeSessionService.getCurrentSession(jukeboxId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Juke Session' })
  findOne(@Param('id', new NumberPipe('id')) id: number) {
    return this.jukeSessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Juke Session' })
  update(
    @Param('id', new NumberPipe('id')) id: number,
    @Body() body: UpdateJukeSessionDto,
  ) {
    return this.jukeSessionService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Juke Session' })
  remove(@Param('id', new NumberPipe('id')) id: number) {
    return this.jukeSessionService.remove(id);
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End Juke Session' })
  endJukeSession(@Param('id', new NumberPipe('id')) id: number) {
    return this.jukeSessionService.endSession(id);
  }

  @Post(':id/members/')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Add Juke Session Member' })
  addJukeSessionMember(
    @Param('id', new NumberPipe('id')) id: number,
    @Body() body: CreateJukeSessionMembershipDto,
  ) {
    return this.jukeSessionService.createMembership(id, body);
  }

  @Post(':id/members/code')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Add Juke Session Member With Join Code' })
  addJukeSessionMemberByJoinCode(
    @Query('joinCode') joinCode: string,
    @Body() body: CreateJukeSessionMembershipDto,
  ) {
    return this.jukeSessionService.addJukeSessionMemberByJoinCode(joinCode, body);
  }

  @Get(':id/members')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Get Juke Session Members' })
  getJukeSessionMembers(
    @Param('id', new NumberPipe('id')) id: number,
  ) {
    return this.jukeSessionService.getMemberships(id);
  }

  @Get(':id/members/:membership_id')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Get Juke Session Member' })
  getJukeSessionMember(
    @Param('membership_id', new NumberPipe('membership_id')) membershipId: number,
  ) {
    return this.jukeSessionService.getMembership(membershipId);
  }

  @Delete(':id/members/:membership_id')
  @Serialize(JukeSessionMembershipDto)
  @ApiOperation({ summary: 'Delete Juke Session Membership' })
  deleteJukeSessionMembership(
    @Param('membership_id', new NumberPipe('membership_id')) membershipId: number,
  ) {
    return this.jukeSessionService.deleteMembership(membershipId);
  }
}
