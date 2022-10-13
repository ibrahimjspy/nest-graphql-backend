import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductModule } from './modules/product/Product.module';
import { CategoriesModule } from './modules/categories/Categories.module';
import { OrdersModule } from './modules/orders/Orders.module';
import { ShopModule } from './modules/shop/Shop.module';
import { CheckoutModule } from './modules/checkout/Checkout.module';
import { AccountModule } from './modules/account/Account.module';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    ProductModule,
    CategoriesModule,
    OrdersModule,
    ShopModule,
    CheckoutModule,
    AccountModule,
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
