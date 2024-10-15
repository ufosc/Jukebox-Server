import { Module } from '@nestjs/common'
import Axios from 'axios'
import { NetworkService } from './network.service'

@Module({
  providers: [
    NetworkService,
    {
      provide: Axios.Axios,
      useValue: Axios.create(),
    },
  ],
})
export class NetworkModule {}
