import { Request, Response } from 'express'
import { AUTH_TOKEN_COOKIE_NAME, NODE_ENV } from 'src/config'
import { User } from 'src/models'
import { authorizeUser, generateToken, registerUser } from 'src/services'
import { responses } from 'src/utils'

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    if (!username || !password) throw new Error('Missing username or password.')
    const user: User = await registerUser({ username, password })

    return responses.created(res, user)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    if (!username || !password) throw new Error('Missing username or password.')
    const user: User = await authorizeUser(username, password)
    const token: string = await generateToken(user)

    if (NODE_ENV === 'development') {
      res.cookie(AUTH_TOKEN_COOKIE_NAME, `Bearer ${token}`)
    }

    return responses.ok(res, { user, token })
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}

export const getUser = async (req: Request, res: Response) => {
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
  const { id } = req.params
  const { body } = req

  try {
    if (!id) throw new Error('Missing user id')
    const user: User | null = await User.findById(id)

    if (!user) return responses.notFound(res, 'User not found.')
    await user.updateOne({ ...body }, { new: true }) // FIXME: Validate input
    const updatedUser = await User.findById(user._id)

    return responses.ok(res, updatedUser)
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}
export const deleteUser = async (req: Request, res: Response) => {
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
