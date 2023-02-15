import { Module } from '@nestjs/common';
import SqsService from 'src/external/endpoints/sqsMessage';
import StripeService from 'src/external/services/stripe';
import { CheckoutController } from './Checkout.controller';
import { CheckoutService } from './Checkout.service';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, StripeService, SqsService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
