import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { NODE_ENV } from 'src/config'
import { UserDto } from 'src/shared'
import { mockUser } from 'src/utils/mock'
import { NetworkService } from '../network/network.service'

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private network: NetworkService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request: Request & { user: UserDto } = context.switchToHttp().getRequest()

    if (NODE_ENV === 'dev') {
      request.user = mockUser
      return next.handle()
    }

    const authHeader = request.headers.authorization || ''
    const [_, token] = authHeader.split(' ')

    try {
      // this.network.setToken(token)
      request.user = await this.network.fetchUser(token)
      return next.handle()
    } catch (e) {
      throw new UnauthorizedException('Could not validate user token', e)
    }
  }
}
