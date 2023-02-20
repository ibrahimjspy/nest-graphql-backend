import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { CategoriesService } from './Categories.service';
import { shopCategoriesDTO, shopIdDTO } from './dto/categories';

@ApiTags('categories')
@Controller('')
export class CategoriesController {
  constructor(private readonly appService: CategoriesService) {}
  // Returns top menu categories
  @Get('/categories/menu')
  findMenuCategories(): Promise<object> {
    return this.appService.getMenuCategories();
  }
  // Returns product card collections and relating categories for landing page
  @Get('/categories/productSections')
  findProductCollections(): Promise<object> {
    return this.appService.getProductSections();
  }

  @Get('/api/v1/categories/:shopId')
  @ApiOperation({
    summary: 'Get categories against given shop id',
  })
  async getShopCategories(
    @Res() res,
    @Param() params: shopIdDTO,
    @Query() filter: shopCategoriesDTO,
  ): Promise<any> {
    return makeResponse(
      res,
      await this.appService.getShopCategories(params.shopId, filter),
    );
  }
}
