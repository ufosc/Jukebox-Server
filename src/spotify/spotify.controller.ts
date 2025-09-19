import { Controller, Delete, Get, Param, Query, Res, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NumberPipe } from 'src/pipes/int-pipe.pipe'
import { UserDto } from 'src/shared'
import { CurrentUser } from 'src/utils/decorators/current-user.decorator'
import { SpotifyAuthService } from './spotify-auth.service'
import { SpotifyService } from './spotify.service'

@ApiTags('Spotify')
@ApiBearerAuth()
@Controller('spotify/')
export class SpotifyController {
  constructor(
    protected spotifyAuthService: SpotifyAuthService,
    protected spotifyService: SpotifyService,
    protected jukeboxService: JukeboxService,
    protected accountLinkService: AccountLinkService,
  ) {}

  @Get('login/')
  @UseInterceptors(AuthInterceptor)
  login(@CurrentUser() user: UserDto, @Query() query: { redirectUri: string; jukeboxId: number }) {
    const { redirectUri, jukeboxId } = query
    const url = this.spotifyAuthService.getSpotifyRedirectUri(user.id, redirectUri, jukeboxId)

    return { url }
  }

  @Get('login/success/')
  async loginSuccessCallback(
    @Res() res: Response,
    @Query() query: { code: string; state: string },
  ) {
    const { code, state } = query
    const { userId, finalRedirect, jukeboxId } = JSON.parse(state)

    const account = await this.spotifyAuthService.handleAuthCode(userId, code)
    const profile = await this.spotifyService.getProfile(account)

    if (jukeboxId != null) {
      // await this.jukeboxService.addLinkToJukebox(jukeboxId, account)
      this.accountLinkService.create(jukeboxId, {
        spotify_account_id: account.id,
        active: true,
      })
    }

    if (finalRedirect) {
      return res.redirect(finalRedirect)
    } else {
      return res.json(profile)
    }
  }

  @Get('accounts/')
  @UseInterceptors(AuthInterceptor)
  async getSpotifyLinks(@CurrentUser() user: UserDto) {
    return this.spotifyAuthService.findUserAccounts(user.id)
  }

  @Delete('accounts/:id/')
  @UseInterceptors(AuthInterceptor)
  async deleteSpotifyLink(
    @CurrentUser() user: UserDto,
    @Param('id', new NumberPipe('id')) id: number,
  ) {
    const link = await this.spotifyAuthService.removeAccount(id)
    return link
  }
}
