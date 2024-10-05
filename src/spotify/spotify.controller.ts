import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { CurrentUser } from 'src/auth/current-user.decorator'

@Controller('spotify')
export class SpotifyController {
  @Get('login')
  @UseInterceptors(AuthInterceptor)
  login(@CurrentUser() user: IUser) {
    console.log('Current user:', user)

    return
  }

  @Get('login/success')
  loginSuccessCallback() {}
}
