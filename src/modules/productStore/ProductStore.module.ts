import { Module } from '@nestjs/common';
import { ProductStoreController } from './ProductStore.controller';
import { ProductStoreService } from './ProductStore.service';

@Module({
  controllers: [ProductStoreController],
  providers: [ProductStoreService],
  exports: [ProductStoreService],
})
export class ProductStoreModule {}
