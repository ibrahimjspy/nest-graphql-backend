import { Controller, Get } from '@nestjs/common';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}
  // Returns landing page banner data
  @Get('/shoppingCart')
  findShoppingCartData(): Promise<object> {
    return this.appService.getShoppingCartData();
  }
}
