import { createConsumer } from 'common/lib'

export const registerConsumers = async () => {
  createConsumer('ping-pong', (data) => {
    console.log('pong')
  })
}
