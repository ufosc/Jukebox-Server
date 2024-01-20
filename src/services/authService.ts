import { User } from 'src/models'

// TODO: Implement register user
export const registerUser = async (details: { username: string; password: string }) =>
  ({ ...details } as User)
// TODO: Implement authorize user
export const authorizeUser = async (username: string, password: string) => username !== password
