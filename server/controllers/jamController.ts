import type { Request, Response } from 'express'
import { httpNotImplemented } from '../utils'

export const startJam = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  return httpNotImplemented(res)
}

export const endJam = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Group']
  #swagger.summary = "Not implemented"
  */
  return httpNotImplemented(res)
}
