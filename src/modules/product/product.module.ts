import { Module } from '@nestjs/common';
import { ProductCardController } from './product.controller';
import { ProductCardService } from './product.service';

@Module({
  controllers: [ProductCardController],
  providers: [ProductCardService],
  exports: [ProductCardService],
})
export class ProductCardModule {}
