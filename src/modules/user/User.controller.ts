import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}
  // Returns shoppingCart data
  @Get('/shoppingCart/:id')
  findShoppingCartDataById(@Param() params): Promise<object> {
    return this.appService.getShoppingCartDataById(params.id);
  }
  // Returns checkout data
  @Get('/checkout/:id')
  findCheckoutDataById(@Param() params): Promise<object> {
    return this.appService.getCheckoutDataById(params.id);
  }
}
