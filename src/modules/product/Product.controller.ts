import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './Product.service';
import { ProductFilterDto, ProductFilterTypeEnum } from './dto';
import { makeResponse } from 'src/core/utils/response';
import { GetBundlesDto, ProductDetailsDto } from './dto/product.dto';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { ProductVariantStockUpdateDTO } from './dto/variant';

@ApiTags('product')
@Controller()
export class ProductController {
  constructor(private readonly appService: ProductService) {
    return;
  }

  /**
   * Get products list with and without filters.
   * @param res response object
   * @param filter {ProductFilterDto} for filtring products
   * @returns list of products
   */
  @Get('/api/v1/products')
  public async findProducts(
    @Res() res,
    @Query() filter: ProductFilterDto,
  ): Promise<object> {
    const { storeId } = filter;
    if (storeId) {
      return makeResponse(
        res,
        await this.appService.getShopProducts(storeId, filter),
      );
    }
    const typeMethod =
      {
        [ProductFilterTypeEnum.POPULAR_ITEMS]: this.appService.getPopularItems,
        [ProductFilterTypeEnum.NEW_ARRIVALS]: this.appService.getProducts,
      }[filter.type] || this.appService.getProducts;

    return makeResponse(res, await typeMethod.call(this.appService, filter));
  }

  @Get('api/v1/product')
  @ApiOperation({
    summary: 'returns detail of product based on id or slug',
  })
  getProductDetails(@Query() filter: ProductDetailsDto): Promise<object> {
    return this.appService.getProductDetails(filter);
  }

  // Returns product images URL
  @Post('/api/v1/product/images')
  downloadProductImages(@Body() body): Promise<object> {
    return this.appService.getDownloadProductImages(body?.urls);
  }

  @Post('api/v1/product/variant/stock/update')
  @ApiOperation({
    summary: 'updates stocks for product variant against its id',
  })
  async cancelOrderFulfillment(
    @Res() res,
    @Body() productVariantDTO: ProductVariantStockUpdateDTO,
    @IsAuthenticated('authorization') token: string,
  ) {
    return makeResponse(
      res,
      await this.appService.updateProductVariantStock(
        productVariantDTO.productVariantId,
        productVariantDTO.quantity,
        token,
      ),
    );
  }

  @Get('/api/v1/product/bundles')
  @ApiOperation({
    summary: 'returns bundles against productId or variantIds',
  })
  async getProductBundles(
    @Res() res,
    @Query() filter: GetBundlesDto,
  ): Promise<any> {
    return makeResponse(res, await this.appService.getProductBundles(filter));
  }
}
