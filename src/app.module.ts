import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
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
import { ImportListModule } from './modules/importList/ImportList.module';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    RouterModule.register(APP_ROUTES),
    ProductModule,
    CategoriesModule,
    OrdersModule,
    ShopModule,
    CheckoutModule,
    AccountModule,
    RetailerModule,
    ImportListModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
