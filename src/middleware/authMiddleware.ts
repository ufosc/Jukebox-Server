/**
 * @fileoverview Authentication middleware.
 */
import jwt from 'jsonwebtoken'

import { NextFunction, Request, Response } from 'express'
import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET_KEY, NODE_ENV } from 'src/config'
import { responses } from 'src/utils'

export const hasAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') return next()

  const token = <string>req.headers['authorization']
  let jwtPayload

  try {
    jwtPayload = <any>jwt.verify(token?.split(' ')[1], JWT_SECRET_KEY!, {
      complete: true,
      issuer: JWT_ISSUER,
      algorithms: [JWT_ALGORITHM],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false
    })

    jwtPayload.payload.originalToken = token
    res.locals = { ...res.locals, token: jwtPayload.payload }
  } catch (error) {
    return responses.unauthorized(res)
  }

  return next()
}

export const hasSpotifyToken = async (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') return next()

  const spotifyToken: string = (req.headers['x-spotify-access-token'] as string) ?? ''
  if (spotifyToken == null) return responses.unauthorized(res, 'Spotify token required.')

  res.locals = { ...res.locals, spotifyAccessToken: spotifyToken }
  return next()
}
