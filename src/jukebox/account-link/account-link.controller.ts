import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AccountLinkService } from './account-link.service';
import { CreateAccountLinkDto, UpdateAccountLinkDto } from './dto/account-link.dto';
import { ApiOperation } from '@nestjs/swagger';
import { NumberPipe } from 'src/pipes/int-pipe.pipe';

@Controller('jukebox/jukeboxes/:jukebox_id/account-link')
export class AccountLinkController {
  constructor(private readonly accountLinkService: AccountLinkService) { }

  @Post()
  @ApiOperation({ summary: 'Creates an Account Link or finds one if the account and jukebox id already exist on one' })
  create(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() createAccountLinkDto: CreateAccountLinkDto,
  ) {
    return this.accountLinkService.create(jukeboxId, createAccountLinkDto);
  }

  @Get()
  findAll(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.accountLinkService.findAll(jukeboxId);
  }

  @Get(':id')
  findOne(@Param('id', new NumberPipe('id')) id: number) {
    return this.accountLinkService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new NumberPipe('id')) id: number,
    @Body() updateAccountLinkDto: UpdateAccountLinkDto,
  ) {
    return this.accountLinkService.update(id, updateAccountLinkDto);
  }

  @Delete(':id')
  remove(@Param('id', new NumberPipe('id')) id: number) {
    return this.accountLinkService.remove(id);
  }

  @Get('active')
  getActiveAccount(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.accountLinkService.getActiveAccount(jukeboxId);
  }
}
