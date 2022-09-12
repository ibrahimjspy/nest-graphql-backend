import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}
  // Returns shoppingCart data
  @Post('/shoppingCart')
  findShoppingCartDataById(@Body() body): Promise<object> {
    return this.appService.getShoppingCartDataById(body.userId);
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
  // Delete bundle
  @Delete('deleteBundleFromCart')
  deleteCartBundle(@Body() body): Promise<object> {
    return this.appService.deleteBundleFromCart(
      body?.userId,
      body?.checkoutBundleIds,
    );
  }
  @Post('updateBundleFromCart')
  updateCartBundle(@Body() body): Promise<object> {
    return this.appService.updateBundleFromCart(body?.userId, body?.bundles);
  }
}
