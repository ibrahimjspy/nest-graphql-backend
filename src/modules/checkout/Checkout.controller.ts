import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './Checkout.service';
import { makeResponse } from '../../core/utils/response';
import { AddBundleDto } from './dto';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {}

  @Get('/:userId')
  async getShoppingCartData(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShoppingCartData(params?.userId),
    );
  }

  @Post('cart/bundle/add')
  async addBundlesToCart(
    @Res() res,
    @Body() addBundleDto: AddBundleDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addToCart(
        addBundleDto.userId,
        addBundleDto.bundles,
      ),
    );
  }

  @Put('cart/bundle/delete')
  async deleteBundleFromCart(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.deleteBundleFromCart(
        body?.userId,
        body?.checkoutBundleIds,
      ),
    );
  }

  @Put('cart/bundle/update')
  async updateCartBundle(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateBundleFromCart(body?.userId, body?.bundles),
    );
  }

  @Put('cart/bundle/select')
  async selectThisShop(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.setBundleAsSelected(body?.userId, body?.bundleIds),
    );
  }

  @Put('cart/bundle/unselect')
  async unSelectThisShop(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.setBundleAsUnselected(
        body?.userId,
        body?.bundleIds,
        body?.checkoutBundleIds,
      ),
    );
  }

  @Post('shippingAddress')
  async addShippingAddress(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addShippingAddress(
        body?.checkoutId,
        body?.addressDetails,
      ),
    );
  }

  @Post('billingAddress')
  async addBillingAddress(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addBillingAddress(
        body?.checkoutId,
        body?.addressDetails,
      ),
    );
  }

  @Get('shippingAndBillingAddress/:checkoutId')
  async getShippingAndBillingAddress(
    @Res() res,
    @Param() params,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShippingAndBillingAddress(params?.checkoutId),
    );
  }

  @Get('shippingMethods/:userId')
  async getShippingMethods(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShippingMethods(params?.userId),
    );
  }

  @Put('shippingMethods/select')
  async selectShippingMethods(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.selectShippingMethods(
        body?.userId,
        body?.shippingIds,
      ),
    );
  }

  @Post('payment/create')
  async createPayment(@Res() res, @Body() body): Promise<object> {
    return makeResponse(res, await this.appService.createPayment(body?.userId));
  }

  @Post('complete')
  async checkoutComplete(@Res() res, @Body() body): Promise<object> {
    return makeResponse(
      res,
      await this.appService.checkoutComplete(body?.userId),
    );
  }
}
