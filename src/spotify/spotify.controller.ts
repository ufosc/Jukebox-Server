import { Controller, Delete, Get, Param, Query, Res, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { SpotifyAuthService } from './spotify-auth.service'
import { SpotifyService } from './spotify.service'

@ApiTags('spotify')
@Controller('spotify/')
export class SpotifyController {
  constructor(
    protected spotifyAuthService: SpotifyAuthService,
    protected spotifyService: SpotifyService,
    protected jukeboxService: JukeboxService,
  ) {}

  @Get('login/')
  @UseInterceptors(AuthInterceptor)
  login(@CurrentUser() user: IUser, @Query() query: { redirectUri: string; jukeboxId: number }) {
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
      await this.jukeboxService.addLinkToJukebox(jukeboxId, account)
    }

    if (finalRedirect) {
      return res.redirect(finalRedirect)
    } else {
      return res.json(profile)
    }
  }

  @Get('links/')
  @UseInterceptors(AuthInterceptor)
  async getSpotifyLinks(@CurrentUser() user: IUser) {
    return this.spotifyAuthService.findUserAccounts(user.id)
  }

  @Delete('links/:id/')
  @UseInterceptors(AuthInterceptor)
  async deleteSpotifyLink(@CurrentUser() user: IUser, @Param('id') id: number) {
    const link = await this.spotifyAuthService.removeAccount(id)
    return link
  }
}
