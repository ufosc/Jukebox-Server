import { BYPASS_AUTH } from 'websocket/config'
import { logger } from '@jukebox/lib'
import type { CustomSocket, SocketNext } from 'websocket/types'

export const authMiddleware = (socket: CustomSocket, next: SocketNext) => {
  if (BYPASS_AUTH) return next()

  const userId = socket.handshake.auth.userId

  if (!userId) {
    logger.warn('Client does not have valid user id.')
    return next(new Error('Must include valid user id.'))
  }
  socket.data.userId = userId
  next()
}
