import mongoose from 'mongoose'
import { logger } from 'server/lib'
import { MONGO_URI, NODE_ENV } from './constants'

console.log("mongo uri:", MONGO_URI)
console.log("node env:", NODE_ENV)
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
