import { Module } from '@nestjs/common';
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
import OsOrderService from 'src/external/services/osOrder/osOrder.service';

@Module({
  imports: [ShippingModule, PaymentModule, CartModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    StripeService,
    MarketplaceCartService,
    SaleorCheckoutService,
    CheckoutValidationService,
    OrdersService,
    OsOrderService,
  ],
  exports: [CheckoutService],
})
export class CheckoutModule {}
