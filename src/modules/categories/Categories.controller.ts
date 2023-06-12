import { CacheTTL, Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { CategoriesService } from './Categories.service';
import {
  CategoriesDto,
  SyncCategoriesDto,
  VendorCategoriesDto,
  shopIdDTO,
} from './dto/categories';
import { CATEGORIES_CACHE_TTL } from 'src/constants';

@ApiTags('categories')
@Controller('')
export class CategoriesController {
  constructor(private readonly appService: CategoriesService) {}

  @Get('/api/v1/categories')
  @ApiOperation({
    summary:
      'returns saleor categories against various filters , you can also fetch categories against a specific shop as well using shop id filter',
  })
  async getProductCategories(
    @Res() res,
    @Query() filter: CategoriesDto,
  ): Promise<object> {
    const { shopId } = filter;
    if (shopId) {
      return makeResponse(
        res,
        await this.appService.getShopCategories(shopId, filter),
      );
    }
    return makeResponse(res, await this.appService.getCategories(filter));
  }

  @Get('/api/v1/categories/sync/:shopId')
  @ApiOperation({
    summary: 'returns categories with status whether they are synced or not',
  })
  async getSyncedCategories(
    @Res() res,
    @Param() params: shopIdDTO,
    @Query() filter: SyncCategoriesDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getSyncedCategories(params.shopId, filter),
    );
  }

  @Get('/categories/menu')
  @ApiOperation({
    summary: 'this api will be deprecated',
  })
  @CacheTTL(CATEGORIES_CACHE_TTL)
  async findMenuCategories(): Promise<object> {
    const categoriesData = await this.appService.menuCategoriesDeprecated();
    return categoriesData['data'];
  }

  @Get('api/v1/categories/menu')
  @ApiOperation({
    summary: 'returns vendor categories by shop id',
  })
  @CacheTTL(CATEGORIES_CACHE_TTL)
  async findVendorCategories(
    @Res() res,
    @Query() filter: VendorCategoriesDto,
  ): Promise<object> {
    return makeResponse(res, await this.appService.getVendorCategories(filter));
  }
}
