/**
 * Main entrypoint.
 *
 * Everything used while in a running state is initialized
 * in this file. No business logic should be defined here.
 */

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register')
}

import { HOST, NODE_ENV, PORT, io, server } from 'websocket/config'
import { registerKafkaConsumers } from 'websocket/events'
import { logger } from 'common/lib'

// const PORT = process.env.PORT || '8333'

io.on('connection', () => {
  logger.debug('Client connected to socket.')
})

if (NODE_ENV === 'production' || NODE_ENV === 'network') {
  registerKafkaConsumers()
}

/** Start server */
server.listen(PORT, () => {
  logger.info(`Socket listening at http://${HOST}:${PORT}`)
})
