import { RouterModule } from '@nestjs/core';
import { CacheModule, Module } from '@nestjs/common';
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
import { redisStore } from 'cache-manager-redis-store';
import { RedisConfig } from './app.cache.constants';
import { CacheService } from './app.cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        ...RedisConfig,
      }),
    }),
    ConfigModule.forRoot(),
    RouterModule.register(APP_ROUTES),
    ProductModule,
    CategoriesModule,
    OrdersModule,
    ShopModule,
    CheckoutModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
