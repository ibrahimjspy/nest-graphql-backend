import { Module } from '@nestjs/common';
import { CartService } from './Cart.service';
import { CartController } from './Cart.controller';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
