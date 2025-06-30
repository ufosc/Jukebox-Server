import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UserDto } from 'src/shared'
import { SpotifyService } from 'src/spotify/spotify.service'
import { CurrentUser } from 'src/utils/decorators'
import { AccountLinkService } from '../account-link/account-link.service'
import { CreatePlayerInteractionDto, PlayerActionDto, SetPlayerDeviceDto } from './dto'
import { PlayerService } from './player.service'

@Controller('jukebox/jukeboxes/:jukebox_id/player/')
export class PlayerController {
  constructor(
    private playerService: PlayerService,
    private spotifyService: SpotifyService,
    private accountLinkService: AccountLinkService,
  ) {}

  @Post()
  async setPlayerDevice(@Param('jukebox_id') jukeboxId: string, @Body() body: SetPlayerDeviceDto) {
    const account = await this.accountLinkService.getActiveAccount(+jukeboxId)
    return this.spotifyService.setPlayerDevice(account.spotify_account, body.device_id)
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
  executeAction(@Param('jukebox_id') jukeboxId: string, @Body() body: PlayerActionDto) {
    return this.playerService.executeAction(+jukeboxId, body)
  }
}
