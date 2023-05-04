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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShopService } from './Shop.service';
import {
  accountIdDTO,
  allShopIdsDTO,
  b2cDto,
  createStoreDTO,
  shopDetailDto,
  shopIdByProductsDTO,
  shopIdDTO,
  vendorIdsDTO,
} from './dto/shop';
import { IsAuthenticated } from 'src/core/utils/decorators';
import {
  myProductsDTO,
  removeMyProductsDto,
  updateMyProductDTO,
} from './dto/myProducts';
import { ShopIdDto, shopInfoDto } from '../orders/dto';

@ApiTags('shop')
@Controller('')
export class ShopController {
  constructor(private readonly appService: ShopService) {}

  @Get('/api/v2/shop')
  @ApiOperation({
    summary: 'Get shop details against shop id or shop url',
  })
  async getShopDetailsV2(
    @Res() res,
    @Query() filter: shopDetailDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopDetailsV2(filter, filter.isB2c),
    );
  }

  @Put('/api/v2/shop')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'updates retailer store details' })
  public async updateStoreInfo(
    @Res() res,
    @Query() filter: ShopIdDto,
    @Body() body: shopInfoDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return await makeResponse(
      res,
      await this.appService.updateStoreInfo(filter.shopId, body, Authorization),
    );
  }

  @Post('/api/v1/store/create/:shopId')
  @ApiBearerAuth('JWT-auth')
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

  @Get('/api/v2/shop/id')
  @ApiOperation({
    summary: 'returns shop id against given productId',
  })
  async getShopIdByProducts(
    @Res() res,
    @Query() filter: shopIdByProductsDTO,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopIdByProductIds(filter.productIds),
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'deletes product from my products ',
  })
  async deleteProductsFromMyProducts(
    @Res() res,
    @Body() body: removeMyProductsDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.removeProductsFromMyProducts(body, Authorization),
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

  @Get('/api/v1/shops/ids')
  @ApiOperation({
    summary: 'returns shop ids against given quantity',
  })
  async getAllShops(@Res() res, @Query() filter: allShopIdsDTO): Promise<any> {
    return makeResponse(
      res,
      await this.appService.getAllShops(filter.quantity),
    );
  }

  @Post('/api/v1/shop/create')
  @ApiOperation({
    summary: 'create a marketplace shop',
  })
  @ApiBearerAuth('JWT-auth')
  async createShop(
    @Res() res,
    @Query() filter: b2cDto,
    @Body() shopInput: createStoreDTO,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.createMarketplaceShop(
        shopInput,
        Authorization,
        filter.isB2c,
      ),
    );
  }
}
