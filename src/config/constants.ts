import 'dotenv/config'

export const NODE_ENV: string = process.env.NODE_ENV || 'development'
export const HOST: string = process.env.HOST || 'localhost'
export const PORT = process.env.PORT || 3000
export const MONGO_URI = process.env.MONGO_UR || 'mongodb://localhost:27017/jukebox'

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
export const JWT_ISSUER = process.env.JWT_ISSUER || 'jukebox'
export const JWT_ALGORITHM = 'HS256'
