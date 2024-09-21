import {
  getUserSpotifyEmails,
  getUserToken,
  registerUser,
  requestPasswordReset,
  resetPassword
} from 'server/controllers'
import { cleanUser, Group, User, type IUser } from 'server/models'
import { apiAuthRequest, apiRequest, httpCreated, Viewset, type ApiArgs } from 'server/utils'

export const registerUserView = apiRequest(
  async (req, res, next) => {
    /**
    @swagger
    #swagger.tags = ['User']
    */
    const { email, password } = req.body
    if (!email || !password) throw new Error('Missing email or password.')

    const user = await registerUser(email, password)
    const serialized: IUser = user.serialize()

    return serialized
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
  const userSerialized: IUser = user.serialize()
  const userGroups = await Group.find({ ownerId: user._id })
  
  const groups = userGroups.map((group) => ({ id: group._id, name: group.name }))

  return { ...userSerialized, groups }
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
  const emails: string[] = await getUserSpotifyEmails(user)

  return emails
})

const UserViewset = new Viewset(User, cleanUser)

export const userCreateView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.create(...args)

  return user
})

export const userListView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['User']
   */
  const users: IUser[] = await UserViewset.list(...args)

  return users
})
export const userGetView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.get(...args)

  return user
})
export const userUpdateView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.update(...args)

  return user
})
export const userPartialUpdateView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.partialUpdate(...args)

  return user
})
export const userDeleteView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.delete(...args)

  return user
})
