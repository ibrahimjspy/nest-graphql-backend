import { Body, Controller, Post, Get, Put } from '@nestjs/common';
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
  @Put('deleteBundleFromCart')
  deleteCartBundle(@Body() body): Promise<object> {
    return this.appService.deleteBundleFromCart(
      body?.userId,
      body?.checkoutBundleIds,
    );
  }
  @Put('updateBundleFromCart')
  updateCartBundle(@Body() body): Promise<object> {
    return this.appService.updateBundleFromCart(body?.userId, body?.bundles);
  }
  @Put('selectBundle')
  selectThisShop(@Body() body): Promise<object> {
    return this.appService.setBundleAsSelected(body?.userId, body?.bundleIds);
  }
  @Put('unselectBundle')
  unSelectThisShop(@Body() body): Promise<object> {
    return this.appService.setBundleAsUnselected(body?.userId, body?.bundleIds);
  }
}
