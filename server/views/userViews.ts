import { getUserToken, registerUser, requestPasswordReset, resetPassword } from 'server/controllers'
import { User, type IUser } from 'server/models'
import { apiRequest, ValidationError, Viewset } from 'server/utils'

export const registerUserView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { email, password } = req.body
  if (!email || !password) throw new Error('Missing email or password.')

  return await registerUser(email, password)
})
export const loginUserView = apiRequest(async (req, res, next) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { email, password } = req.body
  if (!email || !password) throw new Error('Missing email or password.')

  return await getUserToken(email, password)
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

const serializer = (model: User) => {
  return model.serialize()
}
const clean = (data: any): IUser => {
  const keys = Object.keys(data)
  if (!keys.includes('email') || !keys.includes('id')) {
    throw new ValidationError('User must include email field.')
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.firstName ?? '',
    lastName: data.lastName ?? '',
    image: data.image ?? ''
  }
}

export const UserViewset = new Viewset(User, serializer, clean)
