import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserDto } from 'src/shared'
import { Serialize } from 'src/utils'
import { ActiveAccount, CurrentUser } from 'src/utils/decorators'
import { AccountLinkDto } from '../account-link/dto'
import {
  CreatePlayerInteractionDto,
  PlayerActionDto,
  PlayerStateDto,
  SetPlayerDeviceDto,
} from './dto'
import { PlayerService } from './player.service'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { Roles } from 'src/utils/decorators/roles.decorator'
import { RolesGuard } from 'src/utils/guards/roles.guard'

@ApiTags('Player')
@ApiBearerAuth()
@Controller('jukebox/jukeboxes/:jukebox_id/player/')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Roles('member')
  @UseGuards(RolesGuard)
  @Get()
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: '[MEMBER] Get player state' })
  getPlayerState(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.playerService.getPlayerState(jukeboxId)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('device')
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: '[ADMIN] Set player device' })
  setPlayerDevice(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() body: SetPlayerDeviceDto,
  ) {
    return this.playerService.setPlayerDeviceId(jukeboxId, body)
  }

  @Roles('member')
  @UseGuards(RolesGuard)
  @Post('interaction') // like/dislike
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: '[MEMBER] Add player interaction' })
  addInteraction(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @CurrentUser() user: UserDto,
    @Body() body: CreatePlayerInteractionDto,
  ) {
    return this.playerService.addInteraction(jukeboxId, user, body.interaction_type)
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('action') // play/pause/etc
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: '[ADMIN] Execute player action' })
  async executeAction(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() body: PlayerActionDto,
  ) {
    return this.playerService.executeAction(jukeboxId, body)
  }
}
