import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { ShopIdDto } from 'src/modules/orders/dto';
import { ProductFilterDto } from 'src/modules/product/dto';
import { ImportListService } from './ImportList.service';
import { importProductsDTO } from './dto/products';

@ApiTags('import')
@Controller()
export class ImportListController {
  constructor(private readonly appService: ImportListService) {
    return;
  }

  /**
   * Get products list with and without filters.
   * @param res response object
   * @param filter {ProductFilterDto} for filtring products
   * @returns list of products
   */
  @Get('api/v1/import/products/:shopId')
  public async findProducts(
    @Res() res,
    @Query() filter: ProductFilterDto,
    @Param() shopDto: ShopIdDto,
  ): Promise<object> {
    const data = await this.appService.getImportedProduct(
      shopDto.shopId,
      filter,
    );
    return makeResponse(res, data);
  }

  @Post('api/v1/import/products')
  public async importProducts(@Res() res, @Body() body: importProductsDTO) {
    makeResponse;
    return await makeResponse(res, this.appService.importProducts(body));
  }
}
