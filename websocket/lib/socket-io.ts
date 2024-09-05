import http from 'http'
import { Server } from 'socket.io'
import { io } from 'websocket/config'
import type { CustomSocket, ServerEmitEvents } from 'websocket/types'

export const startSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) =>
  new Server<CustomSocket, ServerEmitEvents>(server, {
    // cors: {
    //   origin: '*',
    //   // credentials: true
    // }
  })

export const socketEmit = (ev: string, data: any, room?: string | string[]) => {
  if (room) {
    io.to(room).emit(ev, data)
  } else {
    io.emit(ev, data)
  }
}
