import { Controller, Get } from '@nestjs/common';

@Controller('multiple')
export class TestController {
  @Get('/test')
  findAll(): string {
    return 'Multiple controllers test ';
  }
}
