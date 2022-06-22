import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { fetchParamMock } from './handlers/test';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): Promise<object> {
    return this.appService.getHello();
  }
}
