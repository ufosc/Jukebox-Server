// import { Injectable, NestMiddleware } from '@nestjs/common';

import { Logger } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req

  Logger.debug(`${method} ${originalUrl} ${res.statusCode}`)
  next()
}
