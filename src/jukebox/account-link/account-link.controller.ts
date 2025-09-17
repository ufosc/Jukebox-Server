import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AccountLinkService } from './account-link.service'
import { CreateAccountLinkDto, UpdateAccountLinkDto } from './dto/account-link.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { Roles } from 'src/utils/decorators/roles.decorator'
import { RolesGuard } from 'src/utils/guards/roles.guard'

@ApiTags('AccountLink')
@ApiBearerAuth()
@Controller('jukebox/jukeboxes/:jukebox_id/account-link')
export class AccountLinkController {
  constructor(private readonly accountLinkService: AccountLinkService) {}

  @Roles('member')
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({
    summary:
      '[MEMBER] Creates an Account Link or finds one if the account and jukebox id already exist on one',
  })
  create(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() createAccountLinkDto: CreateAccountLinkDto,
  ) {
    return this.accountLinkService.create(jukeboxId, createAccountLinkDto)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({
    summary: '[ADMIN] Find all account links for a jukebox',
  })
  findAll(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.accountLinkService.findAll(jukeboxId)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({
    summary: '[MEMBER] Find an account link for a jukebox',
  })
  findOne(
    @Param('id', new NumberPipe('id')) id: number,
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
  ) {
    return this.accountLinkService.findOne(id)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({
    summary: '[ADMIN] Update an account link',
  })
  update(
    @Param('id', new NumberPipe('id')) id: number,
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() updateAccountLinkDto: UpdateAccountLinkDto,
  ) {
    return this.accountLinkService.update(id, updateAccountLinkDto)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({
    summary: '[ADMIN] Remove an account link',
  })
  remove(
    @Param('id', new NumberPipe('id')) id: number,
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
  ) {
    return this.accountLinkService.remove(id)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('active')
  @ApiOperation({
    summary: '[ADMIN] Get an active account link for a jukebox',
  })
  getActiveAccount(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.accountLinkService.getActiveAccount(jukeboxId)
  }
}
