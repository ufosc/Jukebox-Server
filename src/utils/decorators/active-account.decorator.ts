import { createParamDecorator, ExecutionContext, NotImplementedException } from '@nestjs/common'
import { AccountLinkDto } from 'src/jukebox/account-link/dto'

export const ActiveAccount = createParamDecorator(
  (data: never, contact: ExecutionContext): AccountLinkDto => {
    throw new NotImplementedException()
  },
)
