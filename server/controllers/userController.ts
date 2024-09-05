import { User } from 'server/models'
import { AuthService } from 'server/services'
import { NotFoundError } from 'server/utils'

// TODO: Implement user from middleware

export const registerUser = async (email: string, password: string): Promise<User> => {
  return await AuthService.registerUser({ email, password })
}

export const getUserToken = async (email: string, password: string): Promise<string> => {
  const user: User = await AuthService.authorizeUser(email, password)
  return await AuthService.generateToken(user)
}

export const requestPasswordReset = async (email: string): Promise<boolean> => {
  const user: User | null = await User.findOne({ email: email })
  console.log('reset password for: ', user)

  // TODO: Send email to user with reset link
  return false
}

export const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
  const user: User | null = await User.findOne({ email: email })

  if (!user) throw new NotFoundError('User not found.')

  const updatedUser: User = await AuthService.changePassword(user, newPassword)
  return true
}
