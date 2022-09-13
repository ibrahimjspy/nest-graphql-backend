import { Module } from '@nestjs/common';
import { CheckoutController } from './Checkout.controller';
import { CheckoutService } from './Checkout.service';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
