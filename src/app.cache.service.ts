// caching.service.ts
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_ENABLED } from './constants';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    if (!CACHE_ENABLED) {
      return null; // Return null or implement a different behavior when caching is disabled
    }

    try {
      return await this.cacheManager.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    if (!CACHE_ENABLED) {
      return; // Don't perform caching when it's disabled
    }

    try {
      return await this.cacheManager.set(key, value);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}
