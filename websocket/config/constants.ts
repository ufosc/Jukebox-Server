import dotenv from 'dotenv'
import 'dotenv/config'

type nodenv = 'development' | 'production' | 'test' | 'network'

export const HOST = process.env.HOST ?? 'localhost'
export const PORT = Number(process.env.PORT) ?? 8000
export const NODE_ENV: nodenv = (process.env.NODE_ENV as nodenv) || 'development'

if (NODE_ENV === 'test') {
  dotenv.config()
  process.env.LOG_LEVEL = 'warn'
}
export const BYPASS_AUTH: boolean = process.env.BYPASS_AUTH === '1'
