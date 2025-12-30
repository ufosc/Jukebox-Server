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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { UserDto } from 'src/shared'
import { CurrentUser } from 'src/utils/decorators'
import { Roles } from 'src/utils/decorators/roles.decorator'
import { RolesGuard } from 'src/utils/guards/roles.guard'
import { CreateJukeSessionDto, JukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import { CreateJukeSessionMembershipDto } from './dto/membership.dto'
import { JukeSessionService } from './juke-session.service'

@ApiTags('JukeSession')
@ApiBearerAuth()
@Controller('jukebox/jukeboxes/:jukebox_id/juke-sessions')
@UseInterceptors(AuthInterceptor)
export class JukeSessionController {
  constructor(private readonly jukeSessionService: JukeSessionService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create/Start juke session' })
  create(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() createJukeSessionDto: CreateJukeSessionDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.jukeSessionService.create(jukeboxId, createJukeSessionDto, user.token)
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

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get(':id/membership/')
  @ApiOperation({ summary: 'Get Juke Session Membership for Current User' })
  getJukeSessionMembership(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('id', new NumberPipe('id')) id: number,
    @CurrentUser() user: UserDto,
  ) {
    return this.jukeSessionService.getMembershipForUser(id, user.id)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post(':id/members/')
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
  @Post(':id/members/join/')
  @ApiOperation({ summary: '[MEMBER] Add Juke Session Member' })
  joinJukeSession(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('id', new NumberPipe('id')) id: number,
    @CurrentUser() user: UserDto,
  ) {
    return this.jukeSessionService.createMembership(id, { user_id: user.id })
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Post(':id/members/code')
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
  @ApiOperation({
    summary: '[MEMBER] (PAGINATED: 0-indexed) Get members/memberships of a juke session',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, schema: { default: 0, minimum: 0 } })
  @ApiQuery({ name: 'rows', required: false, type: Number, schema: { default: 7, minimum: 1 } })
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
  @ApiOperation({ summary: '[ADMIN] Delete member/membership for a juke session' })
  deleteJukeSessionMembership(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Param('membership_id', new NumberPipe('membership_id')) membershipId: number,
  ) {
    return this.jukeSessionService.deleteMembership(membershipId)
  }
}
