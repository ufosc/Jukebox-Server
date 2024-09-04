import { handleSocketSubscribe } from 'websocket/controllers'
import type { CustomSocket, SocketNext } from 'websocket/types'

export const socketHandlers = (socket: CustomSocket, next: SocketNext) => {
  socket.on('subscribe', (data) => handleSocketSubscribe(socket, data))

  next()
}
