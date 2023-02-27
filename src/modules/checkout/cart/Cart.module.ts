import { Module } from '@nestjs/common';
import { CartService } from './Cart.service';
import { CartController } from './Cart.controller';
import { MarketplaceCartService } from './services/marketplace/Cart.marketplace.service';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { SaleorCheckoutService } from '../services/Checkout.saleor';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    SaleorCartService,
    MarketplaceCartService,
    SaleorCheckoutService,
  ],
  exports: [CartService],
})
export class CartModule {}
