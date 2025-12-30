import { HttpService } from '@nestjs/axios'
import { NetworkService } from 'src/network/network.service'
import { AuthInterceptor } from './auth.interceptor'

describe('AuthInterceptor', () => {
  it('should be defined', async () => {
    const httpService = new HttpService()
    const networkService = new NetworkService(httpService)
    const interceptor = new AuthInterceptor(networkService)

    expect(interceptor).toBeDefined()
  })
})
