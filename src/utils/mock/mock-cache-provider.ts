import { CACHE_MANAGER } from '@nestjs/cache-manager'

class MockCache {
  protected cache = {}

  async get(key: string) {
    return this.cache[key]
  }

  async set(key: string, value: any, ttl?: number) {
    this.cache[key] = value
  }
}

/**
 * Mock the cache provider by using standard runtime memory.
 */
export const MockCacheProvider = {
  provide: CACHE_MANAGER,
  useValue: new MockCache(),
}
