import { Module } from '@nestjs/common';
import { ShippingController } from './Shipping.controller';
import { ShippingService } from './Shipping.service';
import { ShippingPromotionService } from './services/Shipping.promotion';
import { SaleorCheckoutService } from '../services/Checkout.saleor';
import { PaymentModule } from '../payment/Payment.module';
import { MarketplaceCartService } from '../cart/services/marketplace/Cart.marketplace.service';

@Module({
  imports: [PaymentModule],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    ShippingPromotionService,
    SaleorCheckoutService,
    MarketplaceCartService,
  ],
  exports: [ShippingService],
})
export class ShippingModule {}
