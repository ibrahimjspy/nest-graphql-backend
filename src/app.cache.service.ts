// caching.service.ts
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IS_CACHE_ENABLED } from './constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string, enableCache = false): Promise<any> {
    if (!IS_CACHE_ENABLED && !enableCache) {
      return null; // Return null or implement a different behavior when caching is disabled
    }

    try {
      return await this.cacheManager.get(key);
    } catch (error) {
      this.logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(
    key: string,
    value: any,
    enableCache = false,
    ttl = 6400,
  ): Promise<void> {
    if (!IS_CACHE_ENABLED && !enableCache) {
      return; // Don't perform caching when it's disabled
    }

    try {
      return await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error('Cache set error:', error);
    }
  }

  /**
   * Generates a cache key using the provided prefix, postfix, and optional unique part.
   *
   * @param {string} prefix - The prefix for the cache key.
   * @param {string} postfix - The postfix for the cache key.
   * @param {string} [unique] - The optional unique part for the cache key.
   * @returns {string} The generated cache key.
   *
   * @example
   * // Generate a cache key with unique part
   * const cacheKeyWithUnique = generateCacheKey('user', 'profile', '123');
   *
   * // Generate a cache key without unique part
   * const cacheKeyWithoutUnique = generateCacheKey('category', 'products');
   */
  generateCacheKey(prefix: string, postfix: string, unique?: string): string {
    const delimiter = '_';
    const keyParts = [prefix, postfix];

    if (unique) {
      keyParts.push(unique);
    }

    const key = keyParts.join(delimiter).slice(0, 250);
    return key;
  }

  async delete(key: string): Promise<void> {
    try {
      return await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error('Cache get error:', error);
      return null;
    }
  }

  async reset(): Promise<void> {
    try {
      return await this.cacheManager.reset();
    } catch (error) {
      this.logger.error('Cache get error:', error);
      return null;
    }
  }
}
