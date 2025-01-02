import { jest } from '@jest/globals'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Repository } from 'typeorm'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>
}

export const CacheMockProvider = {
  provide: CACHE_MANAGER,
  useValue: {
    get: () => '',
    set: () => jest.fn(),
  },
}

export const mockRepo: <T>() => MockType<Repository<T>> = jest.fn(() => ({}))
