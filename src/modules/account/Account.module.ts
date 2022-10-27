import { Module } from '@nestjs/common';
import { AddressModule } from './address/Address.module';

@Module({
  imports: [AddressModule],
})
export class AccountModule {}
