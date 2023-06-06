import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CartService } from './Cart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { makeResponse } from 'src/core/utils/response';
import { AddBundleDto, UserIdDto } from '../dto';
import { UpdateBundleStateDto, UpdateBundlesDto } from '../dto/add-bundle.dto';
import {
  AddOpenPackDTO,
  DeleteBundlesDto,
  ReplaceBundleDto,
  UpdateOpenPackDto,
} from './dto/cart';
import { GetCartDto } from './dto/common.dto';

@ApiTags('checkout/cart')
@Controller('')
@ApiBearerAuth('JWT-auth')
export class CartController {
  private readonly logger = new Logger(CartService.name);
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
        ? await this.appService.selectBundlesAsSelected(
            updateBundleState,
            token,
          )
        : await this.appService.selectBundlesAsUnselected(
            updateBundleState,
            token,
          ),
    );
  }

  @ApiOperation({
    summary: 'replaces checkout bundle with another bundle',
  })
  @Post('api/v1/cart/items/replace')
  @ApiBearerAuth('JWT-auth')
  async replaceCheckoutBundle(
    @Res() res,
    @Body() replaceBundleData: ReplaceBundleDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.replaceCheckoutBundle(replaceBundleData, token),
    );
  }

  @Get('api/v2/cart')
  @ApiOperation({
    summary: 'returns shopping cart data against an checkout id',
  })
  @ApiBearerAuth('JWT-auth')
  async getCartV2(
    @Res() res,
    @Query() filter: GetCartDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getCartV2(
        filter.checkoutId,
        filter.isSelected,
        token,
      ),
    );
  }

  @Post('api/v2/cart')
  @ApiOperation({
    summary:
      'adds bundles to cart, creates a new checkout session based on whether a checkout is given or not',
  })
  @ApiBearerAuth('JWT-auth')
  async addBundlesToCartV2(
    @Res() res,
    @Body() addBundleDto: AddBundleDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    const { checkoutId } = addBundleDto;
    if (!checkoutId) {
      return makeResponse(
        res,
        await this.appService.createCartSession(addBundleDto, token),
      );
    }
    return makeResponse(
      res,
      await this.appService.addToCartV2(addBundleDto, token),
    );
  }

  @ApiOperation({
    summary: 'adds bundles against user email in cart',
  })
  @Post('api/v1/cart/open/pack')
  @ApiBearerAuth('JWT-auth')
  async addOpenPackToCart(
    @Res() res,
    @Body() openPackData: AddOpenPackDTO,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.addOpenPackToCart(openPackData, token),
    );
  }

  @ApiOperation({
    summary: 'updates open pack against a checkout session',
  })
  @Put('api/v1/cart/open/pack')
  @ApiBearerAuth('JWT-auth')
  async updateOpenPack(
    @Res() res,
    @Body() updateOpenPackData: UpdateOpenPackDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    this.logger.log(updateOpenPackData.variants);
    return makeResponse(
      res,
      await this.appService.updateOpenPack(updateOpenPackData, token),
    );
  }

  @ApiOperation({
    summary: 'replaces checkout bundle with another bundle',
  })
  @Post('api/v2/cart/items/replace')
  @ApiBearerAuth('JWT-auth')
  async replaceCheckoutBundleV2(
    @Res() res,
    @Body() replaceBundleData: ReplaceBundleDto,
    @IsAuthenticated('authorization') token: string,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.replaceCheckoutBundleV2(replaceBundleData, token),
    );
  }
}
