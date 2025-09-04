import type { PipeTransform } from '@nestjs/common'
import { BadRequestException } from '@nestjs/common'

export class NumberPipe implements PipeTransform<string, number> {
  constructor(private field: string) {}

  transform(value: string): number {
    const val = parseInt(value, 10)

    if (isNaN(val)) {
      throw new BadRequestException({
        type: 'client_error',
        errors: [
          {
            code: 'is_int',
            detail: 'Value must be an integer',
            attr: this.field,
          },
        ],
      })
    }

    return val
  }
}
