import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './Product.service';
import { ProductFilterDto, ProductFilterTypeEnum } from './dto';
import { makeResponse } from 'src/core/utils/response';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { ProductListDto } from './dto/product.dto';
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
    const typeMethod =
      {
        [ProductFilterTypeEnum.POPULAR_ITEMS]: this.appService.getPopularItems,
        [ProductFilterTypeEnum.NEW_ARRIVALS]: this.appService.getProducts,
      }[filter.type] || this.appService.getProducts;

    return makeResponse(res, await typeMethod.call(this.appService, filter));
  }

  /**
   * DEPRECATED: use `/products` instead
   * @returns default cards data  <All>
   */
  @Get('/product/cards')
  findDefaultCards(): Promise<object> {
    return this.appService.getProductCards();
  }

  // Returns cards data relating to category and collection by <id>
  @Get('/product/cardsByCategoryId/:id')
  findProductCardsByCategoryId(@Param() params): Promise<object> {
    return this.appService.getProductsByCategory(params.id);
  }

  // Returns single product details by <slug>
  @Get('/product/details/:slug')
  findProductDetailsBySlug(@Param() params): Promise<object> {
    return this.appService.getProductDetailsBySlug(params.slug);
  }

  // Returns product list page data relating to category <slug>
  @Get('/product/list/:categoryId')
  async findProductListById(
    @Param() params: ProductListDto,
    @Query() pagination: PaginationDto,
  ) {
    return await this.appService.getProductListPageById(
      params.categoryId,
      pagination,
    );
  }

  // Returns bundles list w.r.t provided <variantIDs>
  @Post('/product/bundles')
  findBundlesByVariantIds(@Body() body): Promise<object> {
    return this.appService.getBundlesByVariantIds(body?.variantIds);
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
}
