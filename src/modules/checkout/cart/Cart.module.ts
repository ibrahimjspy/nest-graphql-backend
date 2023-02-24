import { Module } from '@nestjs/common';
import { CartService } from './Cart.service';
import { CartController } from './Cart.controller';
import { MarketplaceCheckoutService } from './services/marketplace/Cart.marketplace.service';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';

@Module({
  controllers: [CartController],
  providers: [CartService, SaleorCartService, MarketplaceCheckoutService],
  exports: [CartService],
})
export class CartModule {}
