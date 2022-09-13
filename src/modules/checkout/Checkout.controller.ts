import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutService } from './Checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {}
  // Returns shoppingCart data
  @Post('shoppingCart')
  findShoppingCartDataById(@Body() body): Promise<object> {
    return this.appService.getShoppingCartData(body.userId);
  }
  // Add to cart
  @Post('addToCart')
  addBundlesToCart(@Body() body): Promise<object> {
    return this.appService.addToCart(body?.userId, body?.bundles);
  }
  // Delete bundle
  @Post('deleteBundleFromCart')
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
