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
    #swagger.summary = "Register new user"
    #swagger.description = "Create a new user account"
    */
    const { email, password } = req.body
    if (!email || !password) throw new Error('Missing email or password.')

    const user = await registerUser(email, password)
    const serialized: IUser = user.serialize()

    /* 
    #swagger.responses[200] = {
      description: 'Return created user',
      schema: { $ref: '#/definitions/IUser' }
    } 
    */
    return serialized
  },
  { onSuccess: httpCreated }
)
export const loginUserView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  #swagger.summary = "Get token for logging in a user"
  */
  const { email, password } = req.body
  if (!email || !password) throw new Error('Missing email or password.')
  const token = await getUserToken(email, password)

  /*
  #swagger.responses[200] = {
    schema: {
      "token": "example-token"
    },
  }
  */
  return { token }
})

export const currentUserView = apiAuthRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  #swagger.summary = "Get info about the authenticated user"
  
   */
  const { user } = res.locals
  const userSerialized: IUser = user.serialize()
  const userGroups = await Group.find({ ownerId: user._id })

  const groups = userGroups.map((group) => ({ id: group._id, name: group.name }))

  /*
  #swagger.responses[200] = {
    schema: {
      id: "66e9f875b14c1ccc11b3d8f0",
      email: "user@example.com"
    },
  } 
  */
  return { ...userSerialized, groups }
})

// TODO: Remove authentication requirement, send email to user
export const requestPasswordResetView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  #swagger.summary = "Request a password reset for authenticated user (TODO)"
  #swagger.responses[200] = {
      schema: {
        "status": 200,
        "type": "Ok"
      },
      description: ""
    }
   */
  const { email } = req.body
  if (!email) throw new Error('Missing email.')

  await requestPasswordReset(email)
})

export const resetPasswordView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  #swagger.summary = "Allow user to reset password from reset request (TODO)"
  #swagger.responses[200] = {
      schema: {
        "status": 200,
        "type": "Ok"
      },
      description: ""
    }
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
  #swagger.summary = "Get connected spotify accounts for user"
  #swagger.responses[200] = {
      schema: {
        
      },
      description: ""
    }
   */
  const { user } = res.locals
  const emails: string[] = await getUserSpotifyEmails(user)

  return emails
})

const UserViewset = new Viewset(User, cleanUser)

export const userCreateView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.summary = "Create a new user"
   #swagger.tags = ['User']
   
   */
  const user: IUser = await UserViewset.create(...args)

  return user
})

export const userListView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.summary = "Get a list of all users"
   #swagger.tags = ['User']
   */
  const users: IUser[] = await UserViewset.list(...args)

  return users
})
export const userGetView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swaggeď
   #swagger.summary = "Get a single user by id"
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.get(...args)

  return user
})
export const userUpdateView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.summary = "Update all fields on a user"
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.update(...args)

  return user
})
export const userPartialUpdateView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.summary = "Update some fields on a user"
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.partialUpdate(...args)

  return user
})
export const userDeleteView = apiAuthRequest(async (...args: ApiArgs) => {
  /**
   @swagger
   #swagger.summary = "Delete a user by id"
   #swagger.tags = ['User']
   */
  const user: IUser = await UserViewset.delete(...args)

  return user
})
