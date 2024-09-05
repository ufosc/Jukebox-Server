/**
 * Kafka Configuration with KafkaJS
 *
 * Resources:
 * https://kafka.js.org/docs/introduction
 */

import { Kafka, Partitioners, logLevel, type Message } from 'kafkajs'
import { KAFKA_BROKERS, KAFKA_GROUP_ID, NODE_ENV } from '@jukebox/config'
import { logger } from './logger'

const toWinstonLogLevel = (level: logLevel) => {
  switch (level) {
    case logLevel.ERROR:
      return 'warn'
    case logLevel.WARN:
      return 'info'
    case logLevel.INFO:
    case logLevel.NOTHING:
    case logLevel.DEBUG:
      return 'debug'
    default:
      return 'debug'
  }
}

const WinstonLogCreator = () => {
  return (entry: {
    namespace: string
    level: logLevel
    label: string
    log: { message: string }
  }) => {
    const { log, level } = entry
    const { message, ...extra } = log

    logger.log({
      level: toWinstonLogLevel(level),
      message,
      service: 'kafka',
      extra
    })
  }
}

const getKafkaInstance = () => {
  if (NODE_ENV === 'network' || NODE_ENV === 'production') {
    return new Kafka({
      clientId: KAFKA_GROUP_ID,
      brokers: KAFKA_BROKERS,
      logLevel: logLevel.INFO,
      logCreator: WinstonLogCreator,
      connectionTimeout: 10000,
      requestTimeout: 10000,

      retry: {
        retries: 5,
        restartOnFailure: async () => true,
        maxRetryTime: 15000
      }
    })
  } else {
    return {} as Kafka
  }
}

export const kafka = getKafkaInstance()

/**
 * Create a producer for a Kafka topic.
 * @param topic - The topic to produce to.
 * @param action - The action to send to the consumer.
 *
 * @returns wrapper function
 * @param key - Used to determine partition, resource level id
 * @param data - The data to send to Kafka
 *
 */
export const createProducer =
  <T>(topic: string, action?: string) =>
  async (key: string, data: T | T[]) => {
    if (NODE_ENV === 'network' || NODE_ENV === 'production') {
      const producer = kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner,
        allowAutoTopicCreation: true
      })
      await producer.connect()
      let messages: Message[]

      if (Array.isArray(data)) {
        messages = data.map((item) => ({ key, value: JSON.stringify({ action, data: item }) }))
      } else {
        messages = [{ key, value: JSON.stringify({ action, data }) }]
      }

      await producer
        .send({
          topic,
          messages
        })
        .then(() => {
          logger.debug(`Produced message for ${topic}.`)
        })
        .catch((error) => {
          logger.error('Error sending producer message:', error)
        })
      await producer.disconnect()
    }
  }

/**
 * Create a consumer for a Kafka topic.
 *
 * @param topic - The topic to consume from.
 * @param action - The action to listen for.
 * @param callback - The callback to run when the action is received.
 * @param options - Optional configuration parameters
 */
export const createConsumer = async (
  topic: string,
  callback: (data: any, action?: string) => Promise<void> | void,
  options?: { fromBeginning?: boolean; manualCommit?: boolean }
) => {
  if (NODE_ENV === 'network' || NODE_ENV === 'production') {
    const consumer = kafka.consumer({
      groupId: `${KAFKA_GROUP_ID}-${topic}`,
      sessionTimeout: 10000,
      heartbeatInterval: 1000
    })
    await consumer.connect()
    await consumer
      .subscribe({
        topic,
        fromBeginning: options?.fromBeginning || false
      })
      .then(() => {
        logger.info(`Consumer created for ${topic}.`)
      })
    if (!options?.manualCommit) {
      await consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const payload = JSON.parse(message.value?.toString() || '')
            const { action, data } = payload
            logger.debug(`Consumed message for ${topic}.`)

            await callback(data, action)
          } catch (error) {
            logger.error('Error handling data from event queue:', error)
          }
        }
      })
    } else {
      await consumer.run({
        eachBatchAutoResolve: false,
        eachBatch: async ({
          batch,
          resolveOffset,
          heartbeat,
          isRunning,
          isStale,
          commitOffsetsIfNecessary
        }) => {
          if (!isRunning() || isStale()) return
          logger.debug(
            `Consumed batch for ${topic} with ${batch.messages.length} ${
              (batch.messages.length === 1 && 'message') || 'messages'
            }.`
          )
          // pause()

          await Promise.all(
            batch.messages.map(async (message) => {
              if (!isRunning() || isStale()) return

              const payload = JSON.parse(message.value?.toString() || '')
              const { action, data } = payload

              await callback(data, action)
              resolveOffset(message.offset)

              await heartbeat()
            })
          ).then(() => {
            logger.debug(`Finished batch for ${topic}.`)
            commitOffsetsIfNecessary()
          })
        }
      })
    }
  }
}
