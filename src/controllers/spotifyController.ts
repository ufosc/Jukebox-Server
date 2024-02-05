import type { Request, Response } from 'express'
import { User } from 'src/models'
import { SpotifyService } from 'src/services'
import { getQuery, responses } from 'src/utils'
import type { AuthenticatedLocals } from './../middleware/authMiddleware'

export const spotifyLogin = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  const { user } = <AuthenticatedLocals>res.locals
  const { redirectUri } = req.query

  const spotifyLoginUri = SpotifyService.getSpotifyRedirectUri({
    finalRedirect: String(redirectUri || ''),
    userId: String(user._id) 
  })

  return responses.seeOther(res, spotifyLoginUri)
}

export const spotifyLoginCallback = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  const { code, state } = getQuery(req)

  try {
    const parsedState = JSON.parse(JSON.parse(JSON.stringify(state))) // TODO: Fix double parse
    const { userId, finalRedirect } = parsedState
    if (!userId) return responses.badRequest(res, 'Spotify state mismatch error.')

    const user: User | null = await User.findById(userId)
    if (!user) return responses.unauthorized(res)

    const { accessToken, refreshToken, expiresAt } = await SpotifyService.requestSpotifyToken(
      String(code)
    )
    await user.updateOne({
      spotifyAccessToken: accessToken,
      spotifyRefreshToken: refreshToken,
      spotifyTokenExpiration: expiresAt
    })

    if (finalRedirect && String(finalRedirect) !== 'undefined' && finalRedirect !== '') {
      return responses.seeOther(res, finalRedirect)
    } else {
      return responses.ok(res, { accessToken, refreshToken })
    }
  } catch (error: any) {
    return responses.badRequest(res, error?.message || error)
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

    return responses.ok(res, profile)
  } catch (error: any) {
    return responses.badRequest(res, 'Error getting user profile: ' + error?.message)
  }
}

export const spotifySearch = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return responses.notImplemented(res)
}

export const spotifySearchTracks = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return responses.notImplemented(res)
}

export const spotifySearchTrackId = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return responses.notImplemented(res)
}

export const getCurrentlyPlaying = (_: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  #swagger.summary = "Not implemented"
  */
  return responses.notImplemented(res)
}
