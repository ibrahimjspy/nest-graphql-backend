import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
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
    // return ;
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
  @Get('/:id')
  getid(@Param() params): string {
    // console.log(params.id);
    return this.appService.getId(params.id);
  }
}
@Controller('cats')
export class CatsController {
  @Get('/data')
  findAll(): string {
    return 'This action returns all cats';
  }
}
