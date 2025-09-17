import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
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

@Controller('jukebox/jukeboxes/:jukebox_id/player/')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get()
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: 'Get Player State' })
  getPlayerState(@Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number) {
    return this.playerService.getPlayerState(jukeboxId)
  }

  @Post('device')
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: 'Set Player Device' })
  setPlayerDevice(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() body: SetPlayerDeviceDto,
  ) {
    return this.playerService.setPlayerDeviceId(jukeboxId, body)
  }

  @Post('interaction') // like/dislike
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: 'Add Player Interaction' })
  addInteraction(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @CurrentUser() user: UserDto,
    @Body() body: CreatePlayerInteractionDto,
  ) {
    return this.playerService.addInteraction(jukeboxId, user, body.interaction_type)
  }

  @Post('action') // play/pause/etc
  @Serialize(PlayerStateDto)
  @ApiOperation({ summary: 'Execute Player Action' })
  async executeAction(
    @Param('jukebox_id', new NumberPipe('jukebox_id')) jukeboxId: number,
    @Body() body: PlayerActionDto,
  ) {
    return this.playerService.executeAction(jukeboxId, body)
  }
}
