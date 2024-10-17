import type { AxiosStatic } from 'axios'
import { NetworkService } from 'src/network/network.service'
import { AuthInterceptor } from './auth.interceptor'

describe('AuthInterceptor', () => {
  it('should be defined', async () => {
    const axios: AxiosStatic = {
      request: async (config: any) => ({ data: {}, status: 200 }) as any,
    } as AxiosStatic
    const networkService = new NetworkService(axios)
    const interceptor = new AuthInterceptor(networkService)

    expect(interceptor).toBeDefined()
  })
})
