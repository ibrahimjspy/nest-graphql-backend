import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './Product.service';
import { ProductFilterDto, ProductFilterTypeEnum } from './dto';
import { makeResponse } from 'src/core/utils/response';
import {
  GetBundlesDto,
  ProductDetailsDto,
  ProductIdDto,
  ProductListDto,
  ProductListFilterDto,
  RetailerIdDto,
  b2cDTO,
  shopIdDTO,
  shopProductsDTO,
} from './dto/product.dto';
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
  findDefaultCards(@Query() filter: RetailerIdDto): Promise<object> {
    return this.appService.getProductCards(filter.retailerId);
  }

  // Returns cards data relating to category and collection by <id>
  @Get('/product/cardsByCategoryId/:id')
  findProductCardsByCategoryId(
    @Param() params,
    @Query() filter: RetailerIdDto,
  ): Promise<object> {
    return this.appService.getProductsByCategory(params.id, filter.retailerId);
  }

  // Returns single product details by <slug>
  @Get('/product/details/:slug')
  findProductDetailsBySlug(@Param() params): Promise<object> {
    return this.appService.getProductDetailsBySlug(params.slug);
  }

  @Get('api/v1/product')
  @ApiOperation({
    summary: 'returns detail of product based on id and slug',
  })
  getProductDetails(@Query() filter: ProductDetailsDto): Promise<object> {
    return this.appService.getProductDetails(filter);
  }

  // Returns product list page data relating to category <slug>
  @Get('/product/list/:categoryId')
  async findProductListById(
    @Param() params: ProductListDto,
    @Query() filter: ProductListFilterDto,
  ) {
    return await this.appService.getProductListPageById(
      params.categoryId,
      filter,
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

  @Get('/api/v1/products/:shopId')
  @ApiOperation({
    summary: 'Get products against given shopId and categoryId',
  })
  async getShopProductsByCategoryId(
    @Res() res,
    @Param() params: shopIdDTO,
    @Query() filter: shopProductsDTO,
  ): Promise<any> {
    return makeResponse(
      res,
      await this.appService.getShopProductsByCategoryId(params.shopId, filter),
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

  //TODO move this api functionality to product details api
  // Returns single product slug against its id
  @Get('api/v1/product/slug/:productId')
  async getProductSlugById(
    @Res() res,
    @Param() params: ProductIdDto,
    @Query() filter: b2cDTO,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getProductSlug(params.productId, filter.isB2c),
    );
  }
}
