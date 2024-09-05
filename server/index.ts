/**
 * @fileoverview Entry point of the application.
 */
// import 'module-alias/register'
// if (process.env.NODE_ENV === 'production') {
//   require('module-alias/register')
// }

import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'

import { NODE_ENV } from '@jukebox/config'
import { logger } from '@jukebox/lib'
import { HOST, PORT, setupDatabase } from './config'
import { server } from './config/server' // Direct import, otherwise it breaks on tests
import { initializeSwagger } from './docs/swagger'
import { registerConsumers } from './events'

setupDatabase()

if (NODE_ENV === 'production' || NODE_ENV === 'network') {
  registerConsumers()
}

initializeSwagger().then(async () => {
  const swaggerDocument = await import('server/docs/swagger_output.json')
  server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }))
})

server.listen(PORT, () => {
  logger.info(`Server running at http://${HOST}:${PORT}.`)
})
