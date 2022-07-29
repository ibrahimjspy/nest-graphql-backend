import { Controller, Get } from '@nestjs/common';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}
  // Returns shoppingCart data
  @Get('/shoppingCart')
  findCheckoutData(): Promise<object> {
    return this.appService.getShoppingCartData();
  }
  // Returns checkout data
  @Get('/checkout')
  findShoppingCartData(): Promise<object> {
    return this.appService.getCheckoutData();
  }
}
