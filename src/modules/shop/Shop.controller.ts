import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import { makeResponse } from '../../core/utils/response';
import { ApiTags } from '@nestjs/swagger';
import { ShopService } from './Shop.service';

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
}
