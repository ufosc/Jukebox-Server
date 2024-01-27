import 'dotenv/config'

type NodeEnv = 'development' | 'test' | 'production'

export const NODE_ENV: NodeEnv = process.env.NODE_ENV as NodeEnv || 'development'
export const HOST: string = process.env.HOST || 'localhost'
export const PORT = process.env.PORT || 3000
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mongo-jukebox'

export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'secret'
export const JWT_ISSUER = process.env.JWT_ISSUER || 'jukebox'
export const JWT_ALGORITHM = 'HS256'
export const AUTH_TOKEN_COOKIE_NAME = 'dev-auth-token'
// export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'changeme'
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'changeme'
