import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { makeResponse } from './core/utils/response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    return;
  }
  @Get('/health-check')
  async healthCheck(@Res() res): Promise<object> {
    return makeResponse(res, await this.appService.getHealthCheck());
  }
}
