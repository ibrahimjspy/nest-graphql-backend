import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { CategoriesService } from './Categories.service';
import { CategoriesDto, SyncCategoriesDto, shopIdDTO } from './dto/categories';

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
  async findMenuCategories(): Promise<object> {
    const categoriesData = await this.appService.getCategories({ first: 10 });
    return categoriesData['data'];
  }
}
