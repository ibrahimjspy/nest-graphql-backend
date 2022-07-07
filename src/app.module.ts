import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductCardModule } from './modules/productCard/productCard.module';
import { MenuCategoriesModule } from './modules/categories/Categories.module';

@Module({
  // Importing service modules and integrating with app module
  imports: [
    ProductCardModule, //ProductCard
    CacheModule.register(), //Caching support
    ConfigModule.forRoot(), //env config support
    MenuCategoriesModule, //menuCategories
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
