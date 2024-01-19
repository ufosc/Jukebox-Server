import mongoose from 'mongoose'
import { MONGO_URI } from 'config/constants'

export const setupDatabase = async (): Promise<void> => {
  await mongoose
    .connect(MONGO_URI, {
      autoIndex: true

    })
    .then(() => {
      console.log('Connected to MongoDB successfully')
    })
    .catch((err: any) => {
      console.error.bind('Error connecting to MongoDB: ', err)
    })
}
