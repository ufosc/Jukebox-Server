import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotImplementedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { NODE_ENV } from 'src/config'
import { mockUser } from 'src/utils'

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    if (NODE_ENV === 'dev') {
      request.user = mockUser
    } else {
      throw new NotImplementedException()
    }

    return next.handle()
  }
}
