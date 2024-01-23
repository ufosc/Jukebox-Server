import { Request, Response } from 'express'
import { User } from 'src/models'
import { authorizeUser, generateToken, registerUser } from 'src/services/authService'
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

export const logIn = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    if (!username || !password) throw new Error('Missing username or password.')
    const user: User = await authorizeUser(username, password)
    const token: string = await generateToken(user)

    return responses.ok(res, { user, token })
  } catch (error: any) {
    return responses.badRequest(res, error?.message)
  }
}

export const getUser = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}

export const updateUser = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}
export const deleteUser = async (_: Request, res: Response) => {
  return responses.notImplemented(res)
}
