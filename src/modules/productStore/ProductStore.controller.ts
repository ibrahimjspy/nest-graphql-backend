import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { ShopIdDto } from 'src/modules/orders/dto';
import { ProductFilterDto } from 'src/modules/product/dto';
import { ProductStoreService } from './ProductStore.service';
import {
  addToProductStoreDTO,
  deleteFromProductStoreDTO,
} from './dto/products';

@ApiTags('productStore')
@Controller()
export class ProductStoreController {
  constructor(private readonly appService: ProductStoreService) {
    return;
  }

  /**
   * Get products list with and without filters.
   * @param res response object
   * @param filter {ProductFilterDto} for filtring products
   * @returns list of products
   */
  @Get('api/v1/storedProducts/:shopId')
  public async findStoredProducts(
    @Res() res,
    @Query() filter: ProductFilterDto,
    @Param() shopDto: ShopIdDto,
  ): Promise<object> {
    const data = await this.appService.getStoredProducts(
      shopDto.shopId,
      filter,
    );
    return makeResponse(res, data);
  }

  @Post('api/v1/addToProductStore')
  public async addProductsToStore(
    @Res() res,
    @Body() body: addToProductStoreDTO,
  ) {
    return await makeResponse(
      res,
      await this.appService.addToProductStore(body),
    );
  }

  @Delete('api/v1/deleteFromProductStore')
  public async deleteImportedProducts(
    @Res() res,
    @Body() body: deleteFromProductStoreDTO,
  ) {
    return await makeResponse(
      res,
      await this.appService.deleteFromProductStore(body),
    );
  }
}
