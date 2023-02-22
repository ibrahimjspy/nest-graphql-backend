import { Module } from '@nestjs/common';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';
import StripeService from 'src/external/services/stripe';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
  exports: [PaymentService],
})
export class PaymentModule {}
