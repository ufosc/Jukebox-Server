import { type NextFunction, type Request, type Response } from 'express'
import type { AuthResponse } from 'server/middleware'
import { errorResponse, httpOk } from '../responses'

const wrapper = <T extends Response = Response>(
  cb: (req: Request, res: T, next: NextFunction) => Promise<any | void> | any | void,
  config: {
    onSuccess?: (
      res: Response,
      data?: any,
      showStatus?: boolean
    ) => Response<any, Record<string, any>> | void
    showStatus?: boolean
  } = {}
) => {
  const { onSuccess, showStatus } = config

  /**
   @swagger
   #swagger.summary = 'Get single monitor'
   */
  return async (req: Request, res: T, next: NextFunction) => {
    try {
      const data = await cb(req, res, next)

      if (!res.headersSent) {
        return onSuccess ? onSuccess(res, data, showStatus) : httpOk(res, data, showStatus)
      }
    } catch (e) {
      return errorResponse(e, res, next)
    }
  }
}

export const apiRequest = wrapper
export const apiAuthRequest = wrapper<AuthResponse>
