import {
  Body,
  Query,
  Controller,
  Post,
  Get,
  Put,
  Param,
  Res,
} from '@nestjs/common';
import { CheckoutService } from './Checkout.service';
import { makeResponse } from '../../utils/response';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {}

  @Get('shoppingCart')
  async getShoppingCartData(@Res() res, @Query() query): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShoppingCartData(query?.userId),
    );
  }

  @Post('addToCart')
  async addBundlesToCart(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addToCart(body?.userId, body?.bundles),
    );
  }

  @Put('deleteBundleFromCart')
  async deleteCartBundle(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      this.appService.deleteBundleFromCart(
        body?.userId,
        body?.checkoutBundleIds,
      ),
    );
  }

  @Put('updateBundleFromCart')
  async updateCartBundle(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      this.appService.updateBundleFromCart(body?.userId, body?.bundles),
    );
  }

  @Put('selectBundle')
  async selectThisShop(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      this.appService.setBundleAsSelected(body?.userId, body?.bundleIds),
    );
  }

  @Put('unselectBundle')
  async unSelectThisShop(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      this.appService.setBundleAsUnselected(body?.userId, body?.bundleIds),
    );
  }

  @Post('shippingAddress')
  async addShippingAddress(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      this.appService.addShippingAddress(
        body?.checkoutId,
        body?.addressDetails,
      ),
    );
  }

  @Post('billingAddress')
  async addBillingAddress(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      this.appService.addBillingAddress(body?.checkoutId, body?.addressDetails),
    );
  }

  @Get('shippingBillingAddress/:checkoutId')
  async getShippingBillingAddress(
    @Res() res,
    @Param() params,
  ): Promise<object> {
    return makeResponse(
      res,
      this.appService.getShippingBillingAddress(params?.checkoutId),
    );
  }

  @Get('shippingMethods/:userId')
  async getShippingMethods(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      this.appService.getShippingMethods(params?.userId),
    );
  }

  @Put('selectShippingMethods')
  async selectShippingMethods(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      this.appService.selectShippingMethods(body?.userId, body?.shippingIds),
    );
  }

  @Post('createPayment')
  async createPayment(@Res() res, @Body() body): Promise<object> {
    return makeResponse(res, this.appService.createPayment(body?.userId));
  }

  @Post('checkoutComplete')
  async checkoutComplete(@Res() res, @Body() body): Promise<object> {
    return makeResponse(res, this.appService.checkoutComplete(body?.userId));
  }
}
