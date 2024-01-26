import mongoose from 'mongoose'
import { MONGO_URI } from './constants'

export const setupDatabase = async (): Promise<void> => {
  console.log(MONGO_URI)
  await mongoose
    .connect(MONGO_URI, {
      autoIndex: true,
      socketTimeoutMS: 5000,
      
    })
    .then(() => {
      console.log('Connected to MongoDB successfully')
    })
    .catch((err: any) => {
      console.error('Error connecting to MongoDB: ', err)
      console.log('Error connecting to MongoDB: ', err)
    }) 
}
