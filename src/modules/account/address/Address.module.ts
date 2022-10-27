import { Module } from '@nestjs/common';
import { AddressController } from './Address.controller';
import { AddressService } from './Address.service';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
