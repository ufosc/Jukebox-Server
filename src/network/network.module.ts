import { Module } from '@nestjs/common'
import { AxiosProvider } from 'src/utils/mock/mock-axios-provider'
import { NetworkService } from './network.service'

@Module({
  providers: [NetworkService, AxiosProvider],
  exports: [NetworkService, AxiosProvider],
})
export class NetworkModule {}
