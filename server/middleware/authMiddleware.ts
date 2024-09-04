/**
 * @fileoverview Authentication middleware.
 */
import type { Jwt } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

import type { NextFunction, Request, Response } from 'express'
import { AUTH_TOKEN_COOKIE_NAME, JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET_KEY } from 'server/config'
import { User } from 'server/models'
import { NODE_ENV } from 'common/config'
import { httpUnauthorized } from '../utils'

export interface AuthenticatedLocals {
  user: User
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // if (NODE_ENV === 'development') return next()

  let token: string = <string>req.headers['authorization'] || ''
  let jwtPayload: Jwt

  if (NODE_ENV === 'development') {
    token = String(req.cookies[AUTH_TOKEN_COOKIE_NAME])
  }

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
    const user: User | null = await User.findById(userId)
    if (!user) return httpUnauthorized(res)

    res.locals = { ...res.locals, user } as AuthenticatedLocals
  } catch (error) {
    return httpUnauthorized(res)
  }

  return next()
}

export const hasSpotifyToken = async (_: Request, res: Response, next: NextFunction) => {
  // if (NODE_ENV === 'development') return next()

  // const spotifyToken: string = (req.headers['x-spotify-access-token'] as string) ?? ''
  const { userId } = res.locals
  const user: User | null = await User.findById(userId)
  // if (!user) return httpUnauthorized(res, 'User not logged in.')

  // try {
  //   const spotifyToken = user.spotifyAccessToken
  //   if (!spotifyToken) return httpUnauthorized(res, 'Spotify token required.')

  //   const isExpired = user.spotifyTokenExpiration
  //     ? user.spotifyTokenExpiration.getTime() < Date.now()
  //     : true

  //   if (isExpired) {
  //     const currentRefreshToken = user.spotifyRefreshToken || ''
  //     const { accessToken, expiresAt, refreshToken } =
  //       await SpotifyService.refreshUserToken(currentRefreshToken)
  //     await user.updateOne({
  //       spotifyAccessToken: accessToken,
  //       spotifyRefreshToken: refreshToken,
  //       spotifyTokenExpiration: expiresAt
  //     })
  //     res.locals = { ...res.locals, spotifyAccessToken: accessToken }
  //   } else {
  //     res.locals = { ...res.locals, spotifyAccessToken: spotifyToken }
  //   }
  // } catch (error: any) {
  //   return httpBadRequest(res, 'Unable to verify spotify token.')
  // }

  return next()
}
