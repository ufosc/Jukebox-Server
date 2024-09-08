import { getSpotifyRedirectUri } from 'server/lib'
import { SpotifyAuth, User } from 'server/models'
import { SpotifyService } from 'server/services'
import { apiAuthRequest, apiRequest, httpSeeOther, UnauthorizedError } from 'server/utils'

export const spotifyLoginView = apiAuthRequest(async (req, res) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  const { user } = res.locals
  let { redirectUri, groupId } = req.query
  redirectUri = String(redirectUri)

  const spotifyLoginUri = getSpotifyRedirectUri({
    userId: user._id.toString(),
    finalRedirect: redirectUri
  })

  return httpSeeOther(res, spotifyLoginUri)
})

export const spotifyLoginCallbackView = apiRequest(async (req, res) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  let { code, state } = req.query
  code = String(code)

  const parsedState = JSON.parse(JSON.parse(JSON.stringify(state))) // TODO: Fix double parse
  const { userId, finalRedirect } = parsedState
  if (!userId) throw new Error('Spotify state mismatch error.')

  const user: User | null = await User.findById(userId)
  if (!user) throw new UnauthorizedError()

  const spotifyUser = await SpotifyService.authenticateUser(user._id.toString(), code)
  const profile = await spotifyUser.getProfile()

  if (finalRedirect && String(finalRedirect) !== 'undefined' && finalRedirect !== '') {
    return httpSeeOther(res, finalRedirect)
  } else {
    return profile
  }
})

export const removeSpotifyConnection = apiAuthRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['Spotify']
  */
  const { user } = res.locals
  const spotifyEmail = String(req.body.spotifyEmail)

  const deleted = await SpotifyAuth.deleteOne({
    spotifyEmail: spotifyEmail,
    userId: user._id.toString()
  })
  return deleted.deletedCount
})
