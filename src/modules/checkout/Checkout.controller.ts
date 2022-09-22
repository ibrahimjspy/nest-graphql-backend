import { Body, Controller, Post, Get, Put, Param } from '@nestjs/common';
import { CheckoutService } from './Checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {}
  // Returns shoppingCart data
  @Post('shoppingCart')
  getShoppingCartData(@Body() body): Promise<object> {
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
  addShippingAddress(@Body() body): Promise<object> {
    return this.appService.addShippingAddress(
      body?.checkoutId,
      body?.addressDetails,
    );
  }
  @Post('billingAddress')
  addBillingAddress(@Body() body): Promise<object> {
    return this.appService.addBillingAddress(
      body?.checkoutId,
      body?.addressDetails,
    );
  }
  @Get('shippingBillingAddress/:checkoutId')
  getShippingBillingAddress(@Param() params): Promise<object> {
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
  @Post('createPayment')
  createPayment(@Body() body): Promise<object> {
    return this.appService.createPayment(body?.userId);
  }
  @Post('checkoutComplete')
  checkoutComplete(@Body() body): Promise<object> {
    return this.appService.checkoutComplete(body?.userId);
  }
}
