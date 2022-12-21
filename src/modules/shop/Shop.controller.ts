import { Controller, Get, Headers, Param, Query, Res } from '@nestjs/common';
import { makeResponse } from '../../core/utils/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShopService } from './Shop.service';
import { shopIdByVariantsDTO } from './dto/shop';

@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly appService: ShopService) {}
  // Returns landing page banner data
  @Get('/carousel')
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
  @ApiOperation({ summary: 'returns shop id against given variant id' })
  async getShopId(
    @Res() res,
    @Query() filter: shopIdByVariantsDTO,
  ): Promise<object> {
    return makeResponse(
      res,
      filter.productVariantIds.map
        ? await this.appService.getShopIdByVariants(filter.productVariantIds)
        : await this.appService.getShopIdByVariants(
            Array(filter.productVariantIds),
          ),
    );
  }
}
