import { CacheModule, Module } from '@nestjs/common';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
import SearchService from 'src/external/services/search';
import { CachingService } from 'src/app.cache.service';
import { redisStore } from 'cache-manager-redis-store';
import { RedisConfig } from 'src/app.cache.constants';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        ...RedisConfig,
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, SearchService, CachingService],
  exports: [ProductService],
})
export class ProductModule {}
