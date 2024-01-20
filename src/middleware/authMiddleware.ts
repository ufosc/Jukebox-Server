/**
 * @fileoverview Authentication middleware.
 */
import jwt, { Jwt } from 'jsonwebtoken'

import { NextFunction, Request, Response } from 'express'
import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET_KEY, NODE_ENV } from 'src/config'
import { User } from 'src/models'
import { responses } from '../utils'

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') return next()

  const token: string = <string>req.headers['authorization'] ?? ''
  let jwtPayload: Jwt

  try {
    jwtPayload = jwt.verify(token.split(' ')[1], JWT_SECRET_KEY, {
      complete: true,
      issuer: JWT_ISSUER,
      algorithms: [JWT_ALGORITHM],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false
    })

    const { userId } = jwtPayload.payload as any
    res.locals = { ...res.locals, userId }
  } catch (error) {
    return responses.unauthorized(res)
  }

  return next()
}

export const hasSpotifyToken = async (_: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') return next()

  // const spotifyToken: string = (req.headers['x-spotify-access-token'] as string) ?? ''
  const { userId } = res.locals
  const user: User | null = await User.findById(userId)
  if (!user) return responses.unauthorized(res, 'User not logged in.')

  const spotifyToken = user.spotifyAccessToken
  if (spotifyToken == null) return responses.unauthorized(res, 'Spotify token required.')

  res.locals = { ...res.locals, spotifyAccessToken: spotifyToken }
  return next()
}
