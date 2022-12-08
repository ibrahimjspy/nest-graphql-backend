import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './Checkout.service';
import { makeResponse } from '../../core/utils/response';
import { AddBundleDto, UserIdDto } from './dto';
import { UnSelectBundlesType } from './Checkout.utils.type';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {
    return;
  }

  @Get('/:userId')
  async getShoppingCartData(
    @Res() res,
    @Param() userDto: UserIdDto,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShoppingCartData(
        userDto.userId,
        headers.Authorization,
      ),
    );
  }

  @Post('cart/bundle/add')
  async addBundlesToCart(
    @Res() res,
    @Body() addBundleDto: AddBundleDto,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addToCart(
        addBundleDto.userId,
        addBundleDto.bundles,
        headers.Authorization,
      ),
    );
  }

  @Put('cart/bundle/delete')
  async deleteBundleFromCart(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.deleteBundleFromCart(
        body?.userId,
        body?.checkoutBundleIds,
        headers.Authorization,
      ),
    );
  }

  @Put('cart/bundle/update')
  async updateCartBundle(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateBundleFromCart(
        body?.userId,
        body?.bundles,
        headers.Authorization,
      ),
    );
  }

  @Put('cart/bundle/select')
  async selectThisShop(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.setBundleAsSelected(
        body?.userId,
        body?.bundleIds,
        headers.Authorization,
      ),
    );
  }

  @Put('cart/bundle/unselect')
  async unSelectThisShop(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const unSelectBundle: UnSelectBundlesType = {
      userId: body?.userId,
      bundleIds: body?.bundleIds,
      checkoutBundleIds: body?.checkoutBundleIds,
      token: headers?.Authorization,
    };
    return makeResponse(
      res,
      await this.appService.setBundleAsUnselected(unSelectBundle),
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
  async getShippingMethods(
    @Res() res,
    @Param() params,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShippingMethods(
        params?.userId,
        headers?.Authorization,
      ),
    );
  }

  @Put('shippingMethods/select')
  async selectShippingMethods(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.selectShippingMethods(
        body?.userId,
        body?.shippingIds,
        headers?.Authorization,
      ),
    );
  }

  @Post('payment/create')
  async createPayment(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.createPayment(body?.userId, headers?.Authorization),
    );
  }

  @Post('complete')
  async checkoutComplete(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.checkoutComplete(
        body?.userId,
        headers?.Authorization,
      ),
    );
  }
}
