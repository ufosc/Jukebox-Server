import 'dotenv/config'

type nodenv = 'dev' | 'production' | 'test' | 'network' | 'e2e'

export const NODE_ENV: nodenv = (process.env.NODE_ENV as nodenv) || 'dev'
export const HOST: string = process.env.HOST || '127.0.0.1'
export const PORT = process.env.PORT || 3000
export const BASE_URL = process.env.BASE_URL || `http://${HOST}:${PORT}`

export const SPOTIFY_CLIENT_ID =
  NODE_ENV === 'test' ? 'changeme' : process.env.SPOTIFY_CLIENT_ID || 'changeme'
export const SPOTIFY_CLIENT_SECRET =
  NODE_ENV === 'test' ? 'changeme' : process.env.SPOTIFY_CLIENT_SECRET || 'changeme'

export const SPOTIFY_REDIRECT_PATH = '/api/v1/spotify/login/success'
export const SPOTIFY_REDIRECT_URI = `http://127.0.0.1:${PORT}` + SPOTIFY_REDIRECT_PATH
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'streaming',
]

export const CLUBS_URL = process.env.CLUBS_URL ?? 'http://localhost:8080'

export const DB_HOST = process.env.DB_HOST
export const DB_PORT = +(process.env.DB_PORT ?? '5432')
export const DB_USER = process.env.DB_USER ?? 'devuser'
export const DB_PASS = process.env.DB_PASS ?? 'devpass'
export const DB_NAME = !['e2e', 'test'].includes(NODE_ENV)
  ? (process.env.DB_NAME ?? 'devdatabase')
  : 'test'
