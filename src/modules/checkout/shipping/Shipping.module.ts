import { Module } from '@nestjs/common';
import { ShippingController } from './Shipping.controller';
import { ShippingService } from './Shipping.service';
import { ShippingPromotionService } from './services/Shipping.promotion';
import { SaleorCheckoutService } from '../services/Checkout.saleor';
import { PaymentModule } from '../payment/Payment.module';
import { MarketplaceCartService } from '../cart/services/marketplace/Cart.marketplace.service';
import { CheckoutService } from '../Checkout.service';
import { OrdersService } from 'src/modules/orders/Orders.service';
import OsOrderService from 'src/external/services/osOrder/osOrder.service';

@Module({
  imports: [PaymentModule],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    ShippingPromotionService,
    SaleorCheckoutService,
    MarketplaceCartService,
    CheckoutService,
    OsOrderService,
    OrdersService,
  ],
  exports: [ShippingService],
})
export class ShippingModule {}
