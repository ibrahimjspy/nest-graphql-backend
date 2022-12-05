import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { ShopIdDto } from 'src/modules/orders/dto';
import { ProductFilterDto } from 'src/modules/product/dto';
import { ImportService } from './Import.service';
import { importProductsDTO } from './dto/products';

@ApiTags('import')
@Controller()
export class ImportController {
  constructor(private readonly appService: ImportService) {
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
      filter,
      shopDto.shopId,
    );
    return makeResponse(res, data);
  }

  @Post('api/v1/import/products')
  public async addProducts(@Body() body: importProductsDTO) {
    return await this.appService.importProducts(body);
  }
}
