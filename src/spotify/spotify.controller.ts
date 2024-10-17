import { Controller, Delete, Get, Param, Query, Res, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { SpotifyService } from './spotify.service'

@ApiTags('spotify')
@Controller('spotify/')
export class SpotifyController {
  constructor(protected spotifyService: SpotifyService) {}

  @Get('login/')
  @UseInterceptors(AuthInterceptor)
  login(@CurrentUser() user: IUser, @Res() res: Response, @Query() query: { redirectUri: string }) {
    const url = this.spotifyService.getSpotifyRedirectUri(user.id, query.redirectUri)

    return res.redirect(url)
  }

  @Get('login/success/')
  async loginSuccessCallback(
    @Res() res: Response,
    @Query() query: { code: string; state: string },
  ) {
    const { code, state } = query
    const { userId, finalRedirect } = JSON.parse(state)

    const profile = await this.spotifyService.handleAuthCode(userId, code)

    if (finalRedirect) {
      return res.redirect(finalRedirect)
    } else {
      return res.json(profile)
    }
  }

  @Get('links/')
  async getSpotifyLinks(@CurrentUser() user: IUser) {
    return this.spotifyService.findUserLinks(user.id)
  }

  @Delete('links/:id/')
  async deleteSpotifyLink(@CurrentUser() user: IUser, @Param('id') id: number) {
    const link = await this.spotifyService.deleteLink(id)
    return link
  }
}
