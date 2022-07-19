import { Module } from '@nestjs/common';
import { ProductController } from './ProductMain.controller';
import { ProductService } from './ProductMain.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductCardModule {}
