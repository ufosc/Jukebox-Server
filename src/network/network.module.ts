import { Module } from '@nestjs/common'
import { AxiosProvider } from 'src/utils/mock/mock-axios-provider'
import { NetworkService } from './network.service'
import { HttpModule, HttpService } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}
