import type { Request, Response } from 'express'
import { User } from 'server/models'
import { SpotifyService } from 'server/services'
import {
  httpBadRequest,
  httpNotImplemented,
  httpOk,
  httpSeeOther,
  httpUnauthorized
} from 'server/utils'
import type { AuthLocals } from './../middleware/authMiddleware'

export const spotifyLogin = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  const { user } = <AuthLocals>res.locals
  const { redirectUri, groupId } = req.query

  const spotifyLoginUri = SpotifyService.getSpotifyRedirectUri({
    finalRedirect: String(redirectUri || ''),
    userId: String(user._id),
    groupId: String(groupId)
  })

  return httpSeeOther(res, spotifyLoginUri)
}

export const spotifyLoginCallback = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  const { code, state } = req.query

  try {
    const parsedState = JSON.parse(JSON.parse(JSON.stringify(state))) // TODO: Fix double parse
    const { userId, finalRedirect } = parsedState
    if (!userId) return httpBadRequest(res, 'Spotify state mismatch error.')

    const user: User | null = await User.findById(userId)
    if (!user) return httpUnauthorized(res)

    const { accessToken, refreshToken, expiresAt } = await SpotifyService.requestSpotifyToken(
      String(code)
    )
    await user.updateOne({
      spotifyAccessToken: accessToken,
      spotifyRefreshToken: refreshToken,
      spotifyTokenExpiration: expiresAt
    })

    if (finalRedirect && String(finalRedirect) !== 'undefined' && finalRedirect !== '') {
      return httpSeeOther(res, finalRedirect)
    } else {
      return httpOk(res, { accessToken, refreshToken })
    }
  } catch (error: any) {
    return httpBadRequest(res, error?.message || error)
  }
}

export const getUserProfile = async (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  const { spotifyAccessToken } = res.locals
  const spotify = new SpotifyService(spotifyAccessToken)

  try {
    const profile = await spotify.getProfile()

    return httpOk(res, profile)
  } catch (error: any) {
    return httpBadRequest(res, 'Error getting user profile: ' + error?.message)
  }
}

export const spotifySearch = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return httpNotImplemented(res)
}

export const spotifySearchTracks = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return httpNotImplemented(res)
}

export const spotifySearchTrackId = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return httpNotImplemented(res)
}

export const getCurrentlyPlaying = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return httpNotImplemented(res)
}
