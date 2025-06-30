import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { NODE_ENV } from 'src/config'
import { mockUser } from 'src/utils'
import { NetworkService } from '../network/network.service'
import { UserDto } from 'src/shared'

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
      this.network.setToken(token)
      request.user = await this.network.fetchUser()
      return next.handle()
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }
}
