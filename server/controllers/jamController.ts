import type { Request, Response } from 'express'
import { responses } from 'server/utils'

export const startJam = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  return responses.notImplemented(res)
}

export const endJam = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  return responses.notImplemented(res)
}
