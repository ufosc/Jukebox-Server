import { handleSocketSubscribe } from 'src/controllers/controller'
import type { CustomSocket, SocketNext } from 'src/types'

export const socketHandlers = (socket: CustomSocket, next: SocketNext) => {
  socket.on('subscribe', (data) => handleSocketSubscribe(socket, data))

  next()
}
