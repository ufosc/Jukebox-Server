import type { ValidationError } from '@nestjs/common'
import { BadRequestException, ValidationPipe } from '@nestjs/common'

export const validationPipe = new ValidationPipe({
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  whitelist: true,
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    return new BadRequestException({
      type: 'client_error',
      errors: validationErrors.map((error) => {
        const [key, value] = Object.entries(error.constraints || { Unknown: 'Unknown' })
        return {
          code: key[0],
          detail: key[1],
          attr: error.property,
        }
      }),
    })
  },
})
