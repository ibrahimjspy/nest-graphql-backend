import { Module } from '@nestjs/common';
import { ProductCardController } from './productCard.controller';
import { ProductCardService } from './productCard.service';

@Module({
  controllers: [ProductCardController],
  providers: [ProductCardService],
  exports: [ProductCardService],
})
export class ProductCardModule {}
