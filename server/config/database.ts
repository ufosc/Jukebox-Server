import { logger } from '@jukebox/lib'
import mongoose from 'mongoose'
import { MONGO_URI } from './constants'

export const setupDatabase = async (): Promise<void> => {
  await mongoose
    .connect(MONGO_URI, {
      autoIndex: true,
      socketTimeoutMS: 5000
    })
    .then(() => {
      logger.info('Connected to MongoDB successfully')
    })
    .catch((err: any) => {
      logger.error('Error connecting to MongoDB: ', err)
    })
}
