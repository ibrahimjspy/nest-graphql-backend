import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { makeResponse } from '../../core/utils/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShopService } from './Shop.service';
import {
  accountIdDTO,
  createStoreDTO,
  shopIdByVariantsDTO,
  shopIdDTO,
  vendorIdsDTO,
} from './dto/shop';
import { IsAuthenticated } from 'src/core/utils/decorators';
import {
  myProductsDTO,
  removeProductDTO,
  updateMyProductDTO,
} from './dto/myProducts';

@ApiTags('shop')
@Controller('')
export class ShopController {
  constructor(private readonly appService: ShopService) {}
  // Returns landing page banner data
  @Get('shop/carousel')
  findBanner(@Headers() headers): Promise<object> {
    const Authorization: string = headers.authorization;
    return this.appService.getCarouselData(Authorization);
  }

  @Get('/api/v1/details/:shopId')
  async getShippingMethods(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopDetails(params?.shopId),
    );
  }

  @Post('/api/v1/store/create/:shopId')
  @ApiOperation({
    summary: 'create store against given user shop id',
  })
  async createStore(
    @Res() res,
    @Param() params: shopIdDTO,
    @Body() storeInput: createStoreDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.createStore(
        params.shopId,
        storeInput,
        Authorization,
      ),
    );
  }

  @Get('/api/v1/shop/id')
  @ApiOperation({
    summary: 'returns shop id against given variant id or order id',
  })
  async getShopId(
    @Res() res,
    @Query() filter: shopIdByVariantsDTO,
  ): Promise<object> {
    return makeResponse(
      res,
      filter.productVariantIds
        ? await this.appService.getShopIdByVariants(filter.productVariantIds)
        : await this.appService.getShopIdByOrders(filter.orderIds),
    );
  }

  @Get('/api/v1/shop/bank/:shopId')
  @ApiOperation({
    summary: 'returns shop bank details',
  })
  async getShopBankDetails(
    @Res() res,
    @Param() params: shopIdDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getShopBankDetails(params.shopId, Authorization),
    );
  }

  @Post('/api/v1/shop/bank/:shopId')
  @ApiOperation({
    summary: 'saves account Id of account linked with retailer shop',
  })
  async saveShopAccountID(
    @Res() res,
    @Param() params: shopIdDTO,
    @Body() body: accountIdDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.saveShopBankDetails(
        params.shopId,
        body?.accountId,
        Authorization,
      ),
    );
  }

  @Get('/api/v1/shop/my/products/:shopId')
  @ApiOperation({
    summary: 'returns all products pushed to store by a retailer',
  })
  async getMyProducts(
    @Res() res,
    @Param() params: shopIdDTO,
    @Query() filter: myProductsDTO,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getMyProducts(params.shopId, filter),
    );
  }

  @Delete('/api/v1/shop/my/products')
  @ApiOperation({
    summary: 'deletes product from my products ',
  })
  async deleteProductsFromMyProducts(
    @Res() res,
    @Body() body: removeProductDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.removeProductsFromMyProducts(
        body.productIds,
        Authorization,
      ),
    );
  }

  @Put('/api/v1/shop/my/products/update')
  @ApiOperation({
    summary: 'updates a single product in my products',
  })
  async updateMyProducts(
    @Res() res,
    @Body() body: updateMyProductDTO,
    @IsAuthenticated('authorization') token: string,
  ): Promise<any> {
    return makeResponse(
      res,
      await this.appService.updateMyProduct(body, token),
    );
  }

  @Post('/api/v1/shop/my/vendors/:shopId')
  @ApiOperation({
    summary: 'Add my vendors Ids against given user shop id',
  })
  async addVendorsToShop(
    @Res() res,
    @Param() params: shopIdDTO,
    @Body() body: vendorIdsDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.addVendorsToShop(
        params.shopId,
        body.vendorIds,
        Authorization,
      ),
    );
  }

  @Get('/api/v1/shop/my/vendors/:shopId')
  @ApiOperation({
    summary: 'Gets my vendors details against given retailer id',
  })
  async getVendorsFromShop(
    @Res() res,
    @Param() params: shopIdDTO,
  ): Promise<any> {
    return makeResponse(res, await this.appService.getMyVendors(params.shopId));
  }

  @Delete('/api/v1/shop/my/vendors/:shopId')
  @ApiOperation({
    summary: 'Delete my vendors Ids against given user shop id',
  })
  async removeMyVendorsToShop(
    @Res() res,
    @Param() params: shopIdDTO,
    @Body() body: vendorIdsDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.removeMyVendorsToShop(
        params.shopId,
        body.vendorIds,
        Authorization,
      ),
    );
  }
}
