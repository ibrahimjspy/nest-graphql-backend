import { Module } from '@nestjs/common';
import { CartService } from './Cart.service';
import { CartController } from './Cart.controller';
import { MarketplaceCartService } from './services/marketplace/Cart.marketplace.service';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { SaleorCheckoutService } from '../services/Checkout.saleor';
import { ProductService } from 'src/modules/product/Product.service';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    SaleorCartService,
    MarketplaceCartService,
    SaleorCheckoutService,
    ProductService,
  ],
  exports: [CartService],
})
export class CartModule {}
