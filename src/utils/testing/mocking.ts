import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Repository } from 'typeorm'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>
}

export const mockCache = {
  provide: CACHE_MANAGER,
  useValue: {
    get: () => '',
    set: () => jest.fn(),
  },
}

export const mockRepo: <T>() => MockType<Repository<T>> = jest.fn(() => ({}))
