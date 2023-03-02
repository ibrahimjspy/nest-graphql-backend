import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CartService } from './Cart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';
import { AddBundleDto, UserIdDto } from '../dto';
import { UpdateBundleStateDto, UpdateBundlesDto } from '../dto/add-bundle.dto';
import { DeleteBundlesDto } from './dto/cart';

@ApiTags('checkout/cart')
@Controller('')
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly appService: CartService) {}
  @ApiOperation({
    summary: 'returns shopping cart data against a user email',
  })
  @Get('api/v1/cart/:userEmail')
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

  @ApiOperation({
    summary: 'adds bundles against user email in cart',
  })
  @Post('api/v1/cart')
  @ApiBearerAuth('JWT-auth')
  async addBundlesToCart(
    @Res() res,
    @Body() addBundleDto: AddBundleDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addBundlesToCart(
        addBundleDto.userEmail,
        addBundleDto.checkoutId,
        addBundleDto.bundles,
        token,
      ),
    );
  }

  @ApiOperation({
    summary: 'deletes bundles from cart against a user email',
  })
  @Delete('api/v1/cart/items')
  @ApiBearerAuth('JWT-auth')
  async deleteBundleFromCart(
    @Res() res,
    @Body() body: DeleteBundlesDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.deleteBundlesFromCart(
        body?.userEmail,
        body?.checkoutBundleIds,
        token,
      ),
    );
  }

  @ApiOperation({
    summary: 'updates bundles from cart against a user email',
  })
  @Put('api/v1/cart/items')
  @ApiBearerAuth('JWT-auth')
  async updateCartBundle(
    @Res() res,
    @Body() body: UpdateBundlesDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.updateBundlesFromCart(
        body?.userEmail,
        body?.bundles,
        token,
      ),
    );
  }

  @ApiOperation({
    summary: 'updates bundles from cart against a user email',
  })
  @Put('api/v1/cart/items/status')
  @ApiBearerAuth('JWT-auth')
  async updateCartState(
    @Res() res,
    @Body() updateBundleState: UpdateBundleStateDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      updateBundleState.isSelected
        ? await this.appService.selectBundlesAsUnselected(
            updateBundleState,
            token,
          )
        : '',
    );
  }
}
