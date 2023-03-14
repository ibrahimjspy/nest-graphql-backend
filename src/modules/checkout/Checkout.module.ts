import { Module } from '@nestjs/common';
import SqsService from 'src/external/endpoints/sqsMessage';
import StripeService from 'src/external/services/stripe';
import { CheckoutController } from './Checkout.controller';
import { CheckoutService } from './Checkout.service';
import { ShippingModule } from './shipping/Shipping.module';
import { PaymentModule } from './payment/Payment.module';
import { CartModule } from './cart/Cart.module';
import { MarketplaceCartService } from './cart/services/marketplace/Cart.marketplace.service';
import { SaleorCheckoutService } from './services/Checkout.saleor';
import { CheckoutValidationService } from './services/Checkout.validation';
import { OrdersService } from '../orders/Orders.service';

@Module({
  imports: [ShippingModule, PaymentModule, CartModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    StripeService,
    SqsService,
    MarketplaceCartService,
    SaleorCheckoutService,
    CheckoutValidationService,
    OrdersService,
  ],
  exports: [CheckoutService],
})
export class CheckoutModule {}
