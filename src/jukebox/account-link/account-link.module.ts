import { Module } from '@nestjs/common'
import { AccountLinkService } from './account-link.service'
import { AccountLinkController } from './account-link.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountLink } from './entities/account-link.entity'
import { JukeboxService } from '../jukebox.service'
import { Jukebox } from '../entities/jukebox.entity'
import { NetworkService } from 'src/network/network.service'
import { AxiosProvider } from 'src/utils/mock'

@Module({
  imports: [TypeOrmModule.forFeature([AccountLink, Jukebox])],
  controllers: [AccountLinkController],
  providers: [AccountLinkService, JukeboxService, NetworkService, AxiosProvider],
  exports: [AccountLinkService],
})
export class AccountLinkModule {}
