import { Module } from '@nestjs/common';
import { AccountLinkService } from './account-link.service';
import { AccountLinkController } from './account-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountLink } from './entities/account-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountLink])],
  controllers: [AccountLinkController],
  providers: [AccountLinkService],
  exports: [AccountLinkService]
})
export class AccountLinkModule { }
