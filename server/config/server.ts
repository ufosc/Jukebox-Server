import express from 'express'
import morgan from 'morgan'
import multer from 'multer'

import { logger } from '@jukebox/lib'
import cookieParser from 'cookie-parser'
import { errorHandler } from 'server/middleware'
import { router } from 'server/routes'

const server = express()

const urlencodedParser = express.urlencoded({ extended: false })
const jsonParser = express.json()

server.use(urlencodedParser)
server.use(jsonParser)
server.use(multer().any())
server.use(cookieParser())

server.use(
  morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.http(message, { service: 'express' }) }
  })
)

server.use(router)
server.use(errorHandler)

export { server }
