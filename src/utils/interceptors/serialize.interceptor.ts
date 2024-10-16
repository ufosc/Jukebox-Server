import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { UseInterceptors } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

interface ClassConstructor {
  new (...args: any[]): any
}

export const Serialize = (dto: ClassConstructor) => UseInterceptors(new SerializeInterceptor(dto))

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // Runs after request is handled, before sent to client
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // Only show properties marked with "expose"
        })
      }),
    )
  }
}
