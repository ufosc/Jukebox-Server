import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { router } from 'src/routes'

const server = express()

const urlencodedParser = express.urlencoded({ extended: false })
const jsonParser = express.json()
server.use(urlencodedParser)
server.use(jsonParser)

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())
server.use(cors())

server.use(router)

export { server }
