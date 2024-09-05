import { handleSocketSubscribe } from 'websocket/controllers'
import type { CustomSocket, SocketNext } from 'websocket/types'
import { producePing } from './producers'

export const socketHandlers = (socket: CustomSocket, next: SocketNext) => {
  socket.on('subscribe', (data) => handleSocketSubscribe(socket, data))
  socket.on('ping-pong', (data) => producePing(new Date().toLocaleTimeString(), data))

  next()
}
