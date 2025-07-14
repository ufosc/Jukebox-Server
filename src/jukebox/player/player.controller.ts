import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UserDto } from 'src/shared'
import { SpotifyService } from 'src/spotify/spotify.service'
import { ActiveAccount, CurrentUser } from 'src/utils/decorators'
import { AccountLinkDto } from '../account-link/dto'
import { CreatePlayerInteractionDto, PlayerActionDto, SetPlayerDeviceDto } from './dto'
import { PlayerService } from './player.service'

@Controller('jukebox/jukeboxes/:jukebox_id/player/')
export class PlayerController {
  constructor(
    private playerService: PlayerService,
    private spotifyService: SpotifyService,
  ) {}

  @Post()
  async setPlayerDevice(
    @Param('jukebox_id') jukeboxId: string,
    @ActiveAccount() account: AccountLinkDto,
    @Body() body: SetPlayerDeviceDto,
  ) {
    return await this.playerService.setPlayerDeviceId(+jukeboxId, account, body)
  }

  @Get()
  getPlayerState(@Param('jukebox_id') jukeboxId: string) {
    return this.playerService.getPlayerState(+jukeboxId)
  }

  @Post() // like/dislike
  addInteraction(
    @Param('jukebox_id') jukeboxId: string,
    @CurrentUser() user: UserDto,
    @Body() body: CreatePlayerInteractionDto,
  ) {
    return this.playerService.addInteraction(+jukeboxId, user, body.interaction_type)
  }

  @Post() // play/pause/etc
  async executeAction(
    @Param('jukebox_id') jukeboxId: string,
    @ActiveAccount() account: AccountLinkDto,
    @Body() body: PlayerActionDto,
  ) {
    return this.playerService.executeAction(+jukeboxId, account, body)
  }
}
