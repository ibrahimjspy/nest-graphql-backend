import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { CartService } from './Cart.service';
import { ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';
import { AddBundleDto, UserIdDto } from '../dto';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';
import { DeleteBundlesDto } from './dto/cart';

@ApiTags('checkout/cart')
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
    @Body() body: DeleteBundlesDto,
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
    @Body() body: AddBundleDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateBundleFromCart(
        body?.userEmail,
        body?.bundles,
        token,
      ),
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
