import { CacheModule, Module } from '@nestjs/common';
import { CategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';
import { redisStore } from 'cache-manager-redis-store';
import { CacheService } from 'src/app.cache.service';
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
  controllers: [CategoriesController],
  providers: [CategoriesService, CacheService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
