import { createConsumer, logger } from '@jukebox/lib'

export const registerConsumers = async () => {
  createConsumer('ping-pong', (data) => {
    const logData = data ?? 'No data received.'
    logger.info(`Pong: ${logData}`)
  })
}
