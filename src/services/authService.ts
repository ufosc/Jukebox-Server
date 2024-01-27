import { compare, hash, genSalt } from 'bcrypt'
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

  public static registerUser = async (details: {
    username: string
    password: string
  }): Promise<User> => {
    const { username, password } = details
    const existingUser: User | null = await User.findOne({ username: username })

    if (existingUser) throw new Error('Username already exists!')

    const hashedPassword = await this.hashPassword(password)
    const user: User = await User.create({ username, password: hashedPassword })

    return user
  }

  public static authorizeUser = async (username: string, password: string): Promise<User> => {
    if (!username || !password) throw new Error('Missing username or password')

    const user: User | null = await User.findOne({ username })
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
}
