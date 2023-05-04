import { Module } from '@nestjs/common';
import { ProductStoreController } from './ProductStore.controller';
import { ProductStoreService } from './ProductStore.service';
import { ShopService } from '../Shop.service';

@Module({
  controllers: [ProductStoreController],
  providers: [ProductStoreService, ShopService],
  exports: [ProductStoreService],
})
export class ProductStoreModule {}
