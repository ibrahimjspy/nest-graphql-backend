import { Controller, Get } from '@nestjs/common';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}
  // Returns landing page banner data
  @Get('/addToCart')
  findBanner(): Promise<object> {
    return this.appService.getCarouselData();
  }
}
