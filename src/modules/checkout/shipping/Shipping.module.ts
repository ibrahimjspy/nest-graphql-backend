import { Module } from '@nestjs/common';
import { ShippingController } from './Shipping.controller';
import { ShippingService } from './Shipping.service';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
