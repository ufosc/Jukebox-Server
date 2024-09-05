import { logger } from '@jukebox/lib'
import type { NextFunction, Request, Response } from 'express'
import {
  httpBadRequest,
  httpNotFound,
  httpNotImplemented,
  NotFoundError,
  NotImplementedError
} from 'server/utils'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.stack || 'Unknown API Error.')

  if (error instanceof NotFoundError) {
    return next(httpNotFound(res, error))
  } else if (error instanceof NotImplementedError) {
    return next(httpNotImplemented(res, error))
  } else {
    return next(httpBadRequest(res, error))
  }
}
