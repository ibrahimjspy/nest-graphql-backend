import { Body, Controller, Get, Post, Param } from '@nestjs/common';
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
  // Add to cart
  @Post('addToCart')
  addBundlesToCart(@Body() body): Promise<object> {
    return this.appService.addToCart(body?.userId, body?.bundles);
  }
}
