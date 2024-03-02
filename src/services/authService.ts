import { compare, genSalt, hash } from 'bcrypt'
import type { Algorithm } from 'jsonwebtoken'
import { sign } from 'jsonwebtoken'
import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET_KEY } from 'src/config'
import { User } from 'src/models'

export class AuthService {
  private static jwtSecret: string = JWT_SECRET_KEY
  private static jwtIssuer: string = JWT_ISSUER
  private static jwtAlgorithm: Algorithm | undefined = JWT_ALGORITHM || 'HS256'
  private static jwtExpiresIn: string = '5h'
  private static jwtNotBefore: string | number = 0

  /**
   * Hash a password using bycrypt.
   *
   * @param password The password to hash.
   * @return The hashed password.
   */
  private static hashPassword = async (password: string): Promise<string> => {
    if (!password || password === '') throw new Error('No password provided')

    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    return hashedPassword
  }

  private static generateNewPassword = (length: number = 8): string => {
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$'
    let password = ''

    for (let i = 1; i <= length; i++) {
      const char = Math.floor(Math.random() * str.length + 1)

      password += str.charAt(char)
    }

    return password
  }

  public static registerUser = async (details: {
    email: string
    password: string
  }): Promise<User> => {
    const { email, password } = details
    const existingUser: User | null = await User.findOne({ email: email })

    if (existingUser) throw new Error('email already exists!')

    const hashedPassword = await this.hashPassword(password)
    const user: User = await User.create({ email, password: hashedPassword })

    return user
  }

  public static inviteUser = async (email: string): Promise<User> => {
    const user: User = await User.create({ email, password: this.generateNewPassword() })
    // TODO: Send invite email, prompt user to change password

    return user
  }

  public static authorizeUser = async (email: string, password: string): Promise<User> => {
    if (!email || !password) throw new Error('Missing email or password')

    const user: User | null = await User.findOne({ email })
    if (!user) throw new Error('User not found')

    const validPassword = await compare(password, user.password!)

    if (!validPassword) throw new Error('Invalid password')

    return user
  }

  public static generateToken = async (user: User): Promise<string> => {
    const token = sign({ userId: user._id }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: this.jwtIssuer,
      algorithm: this.jwtAlgorithm,
      notBefore: this.jwtNotBefore
    })

    return token
  }

  // FIXME: Changing password should require validation
  public static changePassword = async (user: User, newPassword: string): Promise<User> => {
    const hashedPassword = await this.hashPassword(newPassword)
    const updatedUser: User = await user.updateOne({ password: hashedPassword })

    return updatedUser
  }
}
