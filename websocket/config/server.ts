import express from 'express'
import http from 'http'
import { logger } from '@jukebox/lib'
import { socketHandlers } from 'websocket/events/socketHandlers'
import { startSocket } from 'websocket/lib'

import morgan from 'morgan'
import { authMiddleware } from 'websocket/middleware'
import { router } from './router'

const server = express()
const urlencodedParser = express.urlencoded({ extended: false })

server.use(urlencodedParser)
server.use(
  morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.http(message, { service: 'express' }) }
  })
)
server.use(router)

const httpServer = http.createServer(server)
const io = startSocket(httpServer)

io.use(authMiddleware)
io.use(socketHandlers)

export { io, httpServer as server }
