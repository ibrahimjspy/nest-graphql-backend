import { Module } from '@nestjs/common';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';
import StripeService from 'src/external/services/stripe';
import { SaleorCheckoutService } from '../services/Checkout.saleor';
import { ShippingModule } from '../shipping/Shipping.module';

@Module({
  imports: [ShippingModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, SaleorCheckoutService],
  exports: [PaymentService],
})
export class PaymentModule {}
