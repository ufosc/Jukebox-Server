/**
 * @fileoverview Entry point of the application.
 */
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'

import { HOST, PORT, setupDatabase } from './config'
import { server } from './config/server' // Direct import, otherwise it breaks on tests
import { initializeSwagger } from './docs/swagger'

setupDatabase()

initializeSwagger().then(async () => {
  const swaggerDocument = await import('src/docs/swagger_output.json')
  server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }))
})

server.listen(PORT, () => {
  console.log(`Listening on http://${HOST == '127.0.0.1' ? 'localhost' : HOST}:${PORT}`)
})
