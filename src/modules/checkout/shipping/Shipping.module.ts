import { Module } from '@nestjs/common';
import { ShippingController } from './Shipping.controller';
import { ShippingService } from './Shipping.service';
import { ShippingPromotionService } from './services/Shipping.promotion';
import { SaleorCheckoutService } from '../services/Checkout.saleor';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, ShippingPromotionService, SaleorCheckoutService],
  exports: [ShippingService],
})
export class ShippingModule {}
