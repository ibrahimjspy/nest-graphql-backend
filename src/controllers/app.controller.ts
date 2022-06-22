import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { fetchParamMock } from '../handlers/test';
class PostDTO {
  title: string;
  description: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): Promise<object> {
    return this.appService.getHello();
  }
  @Get('/random')
  getRandom(): string {
    return this.appService.getHi();
  }
  @Post('/post')
  createPost(@Body() body: PostDTO) {
    // console.log(JSON.stringify(body.title));
    console.log(body);
    return `Created a new post with values of ${JSON.stringify(body)} 🚀`;
  }
}
@Controller('shows')
export class CatsController {
  @Get('/rick/:id')
  findAll(@Param() params): Promise<object> {
    return fetchParamMock(parseInt(params.id));
  }
}
