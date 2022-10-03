import { Module } from '@nestjs/common';
import { AccountController } from './Account.controller';
import { AccountService } from './Account.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
