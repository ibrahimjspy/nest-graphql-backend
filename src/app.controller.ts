import { Controller, Delete, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { makeResponse } from './core/utils/response';
import { CacheService } from './app.cache.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: CacheService,
  ) {
    return;
  }

  @Get('/health')
  async healthCheck(@Res() res): Promise<object> {
    return makeResponse(res, await this.appService.getHealthCheck());
  }

  @Delete('cache/reset')
  async resetCache(@Res() res): Promise<object> {
    return makeResponse(res, await this.cacheService.reset());
  }
}
