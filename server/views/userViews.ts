import {
  getUserSpotifyEmails,
  getUserToken,
  registerUser,
  requestPasswordReset,
  resetPassword
} from 'server/controllers'
import { cleanUser, User } from 'server/models'
import { apiAuthRequest, apiRequest, httpCreated, Viewset } from 'server/utils'

export const registerUserView = apiRequest(
  async (req, res, next) => {
    /**
    @swagger
    #swagger.tags = ['User']
    */
    const { email, password } = req.body
    if (!email || !password) throw new Error('Missing email or password.')

    const user = await registerUser(email, password)
    return user.serialize()
  },
  { onSuccess: httpCreated }
)
export const loginUserView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { email, password } = req.body
  if (!email || !password) throw new Error('Missing email or password.')

  const token = await getUserToken(email, password)
  return { token }
})

export const currentUserView = apiAuthRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { user } = res.locals

  return user.serialize()
})

export const requestPasswordResetView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { email } = req.body
  if (!email) throw new Error('Missing email.')

  await requestPasswordReset(email)
})

export const resetPasswordView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  // FIXME: Insecure password reset, HIGH security risk
  const { email, password } = req.body
  if (!email || !password) throw new Error('Missing email or password.')

  await resetPassword(email, password)
})

export const connectedSpotifyAccounts = apiAuthRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { user } = res.locals
  return getUserSpotifyEmails(user)
})

export const UserViewset = new Viewset(User, cleanUser)
