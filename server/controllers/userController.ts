import type { Request, Response } from 'express'
import { AUTH_TOKEN_COOKIE_NAME, NODE_ENV } from 'server/config'
import { User } from 'server/models'
import { AuthService } from 'server/services'
import { responses } from 'server/utils'

// TODO: Implement user from middleware

export const register = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { email, password } = req.body
  try {
    if (!email || !password) throw new Error('Missing email or password.')
    const user: User = await AuthService.registerUser({ email, password })

    return responses.created(res, user)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}

export const login = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { email, password } = req.body
  try {
    if (!email || !password) throw new Error('Missing email or password.')
    const user: User = await AuthService.authorizeUser(email, password)
    const token: string = await AuthService.generateToken(user)

    if (NODE_ENV === 'development') {
      res.cookie(AUTH_TOKEN_COOKIE_NAME, `Bearer ${token}`)
    }

    return responses.ok(res, { user, token })
  } catch (error: any) {
    console.log('error loggin in:', error)
    return responses.badRequest(res, error?.message)
  }
}

export const getUser = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { id } = req.params

  try {
    if (!id) throw new Error('Missing user id')
    const user: User | null = await User.findById(id)

    if (!user) return responses.notFound(res, 'User not found.')
    return responses.ok(res, user)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { id } = req.params
  const { body } = req

  try {
    if (!id) throw new Error('Missing user id')
    const user: User | null = await User.findById(id)

    if (!user) return responses.notFound(res, 'User not found.')
    await user.updateOne({ ...body }, { new: true }) // FIXME: Validate input, disallow password
    const updatedUser = await User.findById(user._id)

    return responses.ok(res, updatedUser)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}
export const deleteUser = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { id } = req.params

  try {
    if (!id) throw new Error('Missing user id')
    const user: User | null = await User.findById(id)

    if (!user) return responses.notFound(res, 'User not found.')

    await user.deleteOne()

    return responses.ok(res, user)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}

export const requestPasswordReset = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  const { email } = req.body

  try {
    if (!email) throw new Error('Missing email')
    const user: User | null = await User.findOne({ email: email })
    console.log('reset password for: ', user)

    // TODO: Send email to user with reset link

    return responses.ok(res, { message: `Password reset to ${email}.` })
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  /**
  @swagger
  #swagger.tags = ['User']
  */
  // FIXME: Insecure password reset, HIGH security risk
  const { email } = req.query
  const { password } = req.body

  try {
    if (!email) throw new Error('Missing email')
    const user: User | null = await User.findOne({ email: email })

    if (!user) throw new Error('User not found.')

    const updatedUser: User = await AuthService.changePassword(user, password)

    return responses.ok(res, updatedUser)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}
