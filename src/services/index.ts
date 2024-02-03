import { AuthService } from './authService'

export const { authorizeUser, generateToken, registerUser, changePassword } = AuthService
export * from './authService'

export { SpotifyService } from './spotifyService'
