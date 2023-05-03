import { Module } from '@nestjs/common';
import { ShopController } from './Shop.controller';
import { ShopService } from './Shop.service';
import { RetailerModule } from './retailer/Retailer.module';
import { ProductStoreModule } from './productStore/ProductStore.module';

@Module({
  imports: [RetailerModule, ProductStoreModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
