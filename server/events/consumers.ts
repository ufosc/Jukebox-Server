import { createConsumer } from 'server/lib'

export const registerConsumers = async () => {
  createConsumer('ping-pong', (data) => {
    console.log('pong')
  })
}
