import 'dotenv/config'

type nodenv = 'development' | 'production' | 'test' | 'network'

// export const NODE_ENV: nodenv = (process.env.NODE_ENV as nodenv) || 'development'
export const HOST: string = process.env.HOST || 'localhost'
export const PORT = process.env.PORT || 3000
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mongo-jukebox'
export const BASE_URL = process.env.BASE_URL || `http://${HOST}:${PORT}`

export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'secret'
export const JWT_ISSUER = process.env.JWT_ISSUER || 'jukebox'
export const JWT_ALGORITHM = 'HS256'
export const AUTH_TOKEN_COOKIE_NAME = 'dev-auth-token'
// export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'changeme'
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'changeme'

// export const LOG_LEVEL = process.env.LOG_LEVEL || 'warn'
// export const LOG_NS = process.env.LOG_NS || 'server'

// export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']
// export const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID ?? 'jbx-server'
