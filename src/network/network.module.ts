import { Module } from '@nestjs/common'
import { AxiosProvider } from 'src/utils/providers/axios.provider'
import { NetworkService } from './network.service'

@Module({
  providers: [NetworkService, AxiosProvider],
  exports: [NetworkService],
})
export class NetworkModule {}
