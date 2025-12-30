import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { NODE_ENV } from 'src/config'
import { NetworkService } from 'src/network/network.service'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private networkService: NetworkService) {}

  canActivate(context: ExecutionContext): boolean {
    return TokenGuard.checkToken(context, this.networkService)
  }

  public static checkToken(context: ExecutionContext, networkService: NetworkService): boolean {
    if (NODE_ENV === 'dev') {
      return true
    }

    const request: Request = context.switchToHttp().getRequest()
    const [_, token] = request.headers.authorization?.split(' ') ?? []

    if (!token) return false

    // networkService.setToken(token)
    return true
  }
}
