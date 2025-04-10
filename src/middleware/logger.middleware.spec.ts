import { RequestLoggerMiddleware } from './logger.middleware'

describe('RequestLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestLoggerMiddleware()).toBeDefined()
  })
})
