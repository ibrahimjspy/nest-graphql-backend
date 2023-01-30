import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_ROUTES } from './app.routes';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/Product.module';
import { CategoriesModule } from './modules/categories/Categories.module';
import { OrdersModule } from './modules/orders/Orders.module';
import { ShopModule } from './modules/shop/Shop.module';
import { CheckoutModule } from './modules/checkout/Checkout.module';
import { AccountModule } from './modules/account/Account.module';
import { RetailerModule } from './modules/retailer/Retailer.module';
import { ProductStoreModule } from './modules/productStore/ProductStore.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RouterModule.register(APP_ROUTES),
    ProductModule,
    CategoriesModule,
    OrdersModule,
    ShopModule,
    CheckoutModule,
    AccountModule,
    RetailerModule,
    ProductStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
