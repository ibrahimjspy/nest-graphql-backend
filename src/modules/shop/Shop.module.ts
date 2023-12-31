import { Module } from '@nestjs/common';
import { ShopController } from './Shop.controller';
import { ShopService } from './services/shop/Shop.service';
import { RetailerModule } from './modules/retailer/Retailer.module';
import { ProductStoreModule } from './modules/productStore/ProductStore.module';
import { MyVendorsService } from './services/myVendors/MyVendors.service';
import { MyProductsService } from './services/myProducts/MyProducts.service';

@Module({
  imports: [RetailerModule, ProductStoreModule],
  controllers: [ShopController],
  providers: [ShopService, MyProductsService, MyVendorsService],
  exports: [ShopService],
})
export class ShopModule {}
