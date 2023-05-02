import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { CategoriesService } from './Categories.service';
import { CategoriesDto, SyncCategoriesDto, shopIdDTO } from './dto/categories';

@ApiTags('categories')
@Controller('')
export class CategoriesController {
  constructor(private readonly appService: CategoriesService) {}

  @Get('/api/v1/categories')
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
}
