import cookieParser from 'cookie-parser'
import express from 'express'

import bodyParser from 'body-parser'
import cors from 'cors'
import { router } from 'src/routes'

const server = express()

server.use(cookieParser())

const urlencodedParser = express.urlencoded({ extended: false })
const jsonParser = express.json()

server.use(urlencodedParser)
server.use(jsonParser)
// server.use(express.bodyParser());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

server.use(cors())

server.use(router)

export { server }
