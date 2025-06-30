import { Module } from '@nestjs/common';
import { AccountLinkService } from './account-link.service';
import { AccountLinkController } from './account-link.controller';

@Module({
  controllers: [AccountLinkController],
  providers: [AccountLinkService],
})
export class AccountLinkModule {}
