import { Module } from '@nestjs/common';
import StripeService from 'src/external/services/stripe';
import { CheckoutController } from './Checkout.controller';
import { CheckoutService } from './Checkout.service';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, StripeService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
