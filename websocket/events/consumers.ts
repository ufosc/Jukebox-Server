/**
 * Kafka Consumers
 */

import { createConsumer, logger } from '@jukebox/lib'
import { socketEmit } from 'websocket/lib'

export const registerKafkaConsumers = () => {
  createConsumer('ping-pong', (data) => {
    socketEmit('ping-pong', data)
    const logData = data ?? 'No data received.'
    logger.info(`Pong: ${logData}`)
  })
}
