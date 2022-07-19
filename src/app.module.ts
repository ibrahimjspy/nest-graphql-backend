import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductModule } from './modules/product/Product.module';
import { CategoriesModule } from './modules/categories/Categories.module';

@Module({
  // Importing service modules and integrating with app module
  imports: [
    ProductModule, //Products
    CategoriesModule, //Categories
    CacheModule.register(), //Caching support
    ConfigModule.forRoot(), //env config support
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor, // cache intercepting class <graphQl>
    },
  ],
})
export class AppModule {}
