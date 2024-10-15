import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

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
