import { Body, Controller, Post, Get, Put, Param } from '@nestjs/common';
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
  @Post('shippingAddress')
  shippingAddress(@Body() body): Promise<object> {
    return this.appService.addShippingAddress(
      body?.checkoutId,
      body?.addressDetails,
    );
  }
  @Post('billingAddress')
  billingAddress(@Body() body): Promise<object> {
    return this.appService.addShippingAddress(
      body?.checkoutId,
      body?.addressDetails,
    );
  }
  @Get('shippingBillingAddress/:checkoutId')
  shippingBillingAddress(@Param() params): Promise<object> {
    return this.appService.getShippingBillingAddress(params?.checkoutId);
  }
  @Get('getShippingMethods/:userId')
  getShippingMethod(@Param() params): Promise<object> {
    return this.appService.getShippingMethod(params?.userId);
  }
  @Put('selectShippingMethods')
  selectShippingMethods(@Body() body): Promise<object> {
    return this.appService.selectShippingMethods(
      body?.userId,
      body?.shippingIds,
    );
  }
}
