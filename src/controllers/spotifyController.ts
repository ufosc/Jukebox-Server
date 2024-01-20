import { Request, Response } from 'express'
import { User } from 'src/models'
import { SpotifyService } from 'src/services'
import { responses } from 'src/utils'

export const spotifyLogin = async (req: Request, res: Response) => {
  // Start here in spotify auth
  const { userId } = res.locals
  const { redirectUri } = req.query

  const state = JSON.stringify({ redirectUri, userId })

  const spotifyLoginUri = SpotifyService.getSpotifyRedirectUri(state)
  return responses.seeOther(res, spotifyLoginUri)
}

// TODO: How should auth be handled? Frontend or backend?
export const spotifyLoginCallback = async (req: Request, res: Response) => {
  // Spotify sends user back to here
  // Ask for tokens, set them then redirect to tokens route
  const { code, state } = req.query
  const { userId, redirectUri } = JSON.parse(JSON.stringify(state))
  if (!userId) return responses.badRequest(res, 'Spotify state mismatch error.')

  const user: User | null = await User.findById(userId)
  if (!user) return responses.unauthorized(res)

  const { accessToken, refreshToken } = await SpotifyService.requestSpotifyToken(
    String(code),
    user._id.toString()
  )
  await user.updateOne({ spotifyAccessToken: accessToken, spotifyRefreshToken: refreshToken })

  // return responses.notImplemented(res)
  if (redirectUri) {
    return responses.seeOther(res, redirectUri)
  } else {
    return responses.found(res, '/api/spotify/token')
  }
}

export const spotifyTokens = (_: Request, res: Response) => {
  // Final destination - display tokens
  return responses.notImplemented(res)
}

export const spotifyTest = (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const spotifySearch = (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const spotifySearchTracks = (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const spotifySearchTrackId = (_: Request, res: Response) => {
  return responses.notImplemented(res)
}
