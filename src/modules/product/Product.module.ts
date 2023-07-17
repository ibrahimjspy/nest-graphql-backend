import { Module } from '@nestjs/common';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
import SearchService from 'src/external/services/search';

@Module({
  controllers: [ProductController],
  providers: [ProductService, SearchService],
  exports: [ProductService],
})
export class ProductModule {}
