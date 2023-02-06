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
// import { b2bClientintent } from './B2BClientsmapping';
import { B2BClientPlatform } from 'src/constants';

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
    const typeMethod =
      {
        [B2BClientPlatform]:
          this.appService.createCheckoutSharovePlatformService,
      }[body.userEmail] || this.appService.createCheckoutendConsumerService;
    return makeResponse(
      res,
      await typeMethod.call(this.appService, body.userEmail, token),
    );
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
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { userEmail, userName, payment_methodID } = body;
    return makeResponse(
      res,
      await this.appService.createPayment(
        userName,
        userEmail,
        payment_methodID,
        token,
      ),
    );
  }

  @Post('payment/preauth')
  async preAuth(
    @Res() res,
    @Body() body,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { userEmail, paymentMethodId, checkoutID } = body;

    return makeResponse(
      res,
      await this.appService.paymentPreAuth(
        userEmail,
        paymentMethodId,
        checkoutID,
        token,
      ),
    );
  }

  @Get('cards/:userEmail')
  async getCards(
    @Res() res,
    @Param() params,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { userEmail } = params;
    return makeResponse(res, await this.appService.getCards(userEmail));
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
