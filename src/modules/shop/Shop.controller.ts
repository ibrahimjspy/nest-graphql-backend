import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { makeResponse } from '../../core/utils/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShopService } from './Shop.service';
import { accountIdDTO, shopIdByVariantsDTO, shopIdDTO } from './dto/shop';

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
}
