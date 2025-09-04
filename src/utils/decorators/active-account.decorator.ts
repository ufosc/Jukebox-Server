import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator, NotImplementedException } from '@nestjs/common'
import type { AccountLinkDto } from 'src/jukebox/account-link/dto'

export const ActiveAccount = createParamDecorator(
  (data: never, contact: ExecutionContext): AccountLinkDto => {
    throw new NotImplementedException()
  },
)
