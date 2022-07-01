import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductCardModule } from './productCard/productCard.module';
import { MenuCategoriesModule } from './menuCategories/menuCategories.module';

@Module({
  // Importing service modules and integrating with app module
  imports: [
    ProductCardModule, //ProductCard
    CacheModule.register(),
    ConfigModule.forRoot(),
    MenuCategoriesModule, //menuCategories
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
