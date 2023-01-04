import { Module } from '@nestjs/common';
import { AddressModule } from './address/Address.module';
import { UserModule } from './user/user.mudule';

@Module({
  imports: [AddressModule, UserModule],
})
export class AccountModule {}
