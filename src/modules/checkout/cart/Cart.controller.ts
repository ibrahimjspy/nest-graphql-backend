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
import { CartService } from './Cart.service';
import { ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';
import { AddBundleDto, UserIdDto } from '../dto';
import { UnSelectBundlesType } from '../Checkout.utils.type';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';

@ApiTags('cart')
@Controller('')
export class CartController {
  constructor(private readonly appService: CartService) {}
  // Returns top menu categories
  @Get('checkout/:userEmail')
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

  @Post('checkout/cart/bundle/add')
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

  @Put('checkout/cart/bundle/delete')
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

  @Put('checkout/cart/bundle/update')
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

  @Put('checkout/cart/bundle/select')
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

  @Put('checkout/cart/bundle/unselect')
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

  @Put('checkout/cart/bundle/state/update')
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
}
