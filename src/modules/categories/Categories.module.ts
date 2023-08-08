import { CacheModule, Module } from '@nestjs/common';
import { CategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';
import { redisStore } from 'cache-manager-redis-store';
import { CachingService } from 'src/app.cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        host: 'localhost', // Redis server host
        port: 6378, // Redis server port
        ttl: 8400, // Default cache TTL in seconds
        max: 1000,
      }),
    }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CachingService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
