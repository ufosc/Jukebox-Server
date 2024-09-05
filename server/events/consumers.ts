import { createConsumer } from '@jukebox/lib'

export const registerConsumers = async () => {
  createConsumer('ping-pong', (data) => {
    console.log('pong')
  })
}
