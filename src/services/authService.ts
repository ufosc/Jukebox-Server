import { User } from 'src/models'

// TODO: Implement register user
export const registerUser = async (details: {
  username: string
  password: string
}): Promise<User> => ({ ...details } as User)

// TODO: Implement authorize user
export const authorizeUser = async (username: string, password: string): Promise<User> => ({ username, password } as User)

// TODO: Implement generate token
export const generateToken = async (user: User): Promise<string> => 'token' + user.username
