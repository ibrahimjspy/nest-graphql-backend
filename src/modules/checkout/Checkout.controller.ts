import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './Checkout.service';
import { makeResponse } from '../../core/utils/response';
import { AddBundleDto, UserIdDto } from './dto';
import { UpdateBundleStateDto } from 'src/modules/checkout/dto/add-bundle.dto';
import { UnSelectBundlesType } from './Checkout.utils.type';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { b2bClientintent } from './B2BClientsmapping';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly appService: CheckoutService) {
    return;
  }

  @Get('/:userEmail')
  async getShoppingCartData(
    @Res() res,
    @Param() userDto: UserIdDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShoppingCartData(userDto.userEmail, token),
    );
  }

  @Post('cart/bundle/add')
  async addBundlesToCart(
    @Res() res,
    @Body() addBundleDto: AddBundleDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addToCart(
        addBundleDto.userEmail,
        addBundleDto.bundles,
        token,
      ),
    );
  }

  @Post('create/checkout')
  async createCheckout(
    @Res() res,
    @Body() body,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(res, await b2bClientintent(body.userEmail, token));
  }

  @Put('cart/bundle/delete')
  async deleteBundleFromCart(
    @Res() res,
    @Body() body,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.deleteBundleFromCart(
        body?.userEmail,
        body?.checkoutBundleIds,
        token,
      ),
    );
  }

  @Put('cart/bundle/update')
  async updateCartBundle(
    @Res() res,
    @Body() body,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateBundleFromCart(
        body?.userEmail,
        body?.bundle,
        token,
      ),
    );
  }

  @Put('cart/bundle/state/update')
  async updateCartState(
    @Res() res,
    @Body() updateBundleState: UpdateBundleStateDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateCheckoutBundleState(updateBundleState, token),
    );
  }

  @Put('cart/bundle/select')
  async selectThisShop(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.setBundleAsSelected(
        body?.userId,
        body?.bundleIds,
        Authorization,
      ),
    );
  }

  @Put('cart/bundle/unselect')
  async unSelectThisShop(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    const unSelectBundle: UnSelectBundlesType = {
      userId: body?.userId,
      bundleIds: body?.bundleIds,
      checkoutBundleIds: body?.checkoutBundleIds,
      token: Authorization,
    };
    return makeResponse(
      res,
      await this.appService.setBundleAsUnselected(unSelectBundle),
    );
  }

  @Post('shippingAddress')
  async addShippingAddress(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.addShippingAddress(
        body?.checkoutId,
        body?.addressDetails,
        Authorization,
      ),
    );
  }

  @Post('billingAddress')
  async addBillingAddress(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.addBillingAddress(
        body?.checkoutId,
        body?.addressDetails,
        Authorization,
      ),
    );
  }

  @Get('shippingAndBillingAddress/:checkoutId')
  async getShippingAndBillingAddress(
    @Res() res,
    @Param() params,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShippingAndBillingAddress(
        params?.checkoutId,
        Authorization,
      ),
    );
  }

  @Get('shippingMethods/:userId')
  async getShippingMethods(
    @Res() res,
    @Param() params,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShippingMethods(params?.userId, Authorization),
    );
  }

  @Put('shippingMethods/select')
  async selectShippingMethods(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.selectShippingMethods(
        body?.userId,
        body?.shippingIds,
        Authorization,
      ),
    );
  }

  @Post('payment/create')
  async createPayment(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.createPayment(body?.userId, Authorization),
    );
  }

  @Post('complete')
  async checkoutComplete(
    @Res() res,
    @Body() body,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.checkoutComplete(body?.userId, Authorization),
    );
  }
}
