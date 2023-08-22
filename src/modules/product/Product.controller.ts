import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './Product.service';
import { ProductFilterDto, ProductFilterTypeEnum } from './dto';
import { makeResponse } from 'src/core/utils/response';
import {
  GetBundlesDto,
  GetMoreLikeThisDto,
  ProductDetailsDto,
} from './dto/product.dto';
import { IsAuthenticated } from 'src/core/utils/decorators';
import { ProductVariantStockUpdateDTO } from './dto/variant';
import { GetMappingDto } from '../shop/dto/shop';
import { CacheService } from 'src/app.cache.service';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { CATEGORIES_CACHE } from 'src/constants';

@ApiTags('product')
@Controller()
export class ProductController {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly appService: ProductService,
    private readonly cacheManager: CacheService,
  ) {
    return;
  }

  /**
   * Get products list with and without filters.
   * @param res response object
   * @param filter {ProductFilterDto} for filtring products
   * @returns list of products
   */
  @Get('/api/v1/products')
  @ApiOperation({
    summary:
      'return products list using various filter provided by saleor -- it also can be used to fetch products against shop',
  })
  public async findProducts(
    @Res() res,
    @Query() filter: ProductFilterDto,
  ): Promise<object> {
    const productCacheKey = this.cacheManager.generateCacheKey(
      'products',
      'list',
      JSON.stringify(filter),
    );
    const cachedProducts = await this.cacheManager.get(
      productCacheKey,
      CATEGORIES_CACHE,
    );

    if (cachedProducts && filter?.first && filter?.first < 10) {
      this.logger.log('found cached products');
      return makeResponse(res, cachedProducts as object);
    }
    this.logger.log('making expensive call to retrieve products');
    let response;
    const { storeId, collections, type } = filter;

    if (storeId) {
      response = await this.appService.getShopProducts(filter);
    } else if (collections) {
      response = await this.appService.getProductByCollections(filter);
    } else {
      const typeMethod =
        {
          [ProductFilterTypeEnum.POPULAR_ITEMS]:
            this.appService.getPopularItems,
          [ProductFilterTypeEnum.NEW_ARRIVALS]: this.appService.getProducts,
        }[type] || this.appService.getProducts;

      response = await typeMethod.call(this.appService, filter);
    }
    if (filter?.first && filter?.first < 10) {
      this.addToCache(productCacheKey, response);
    }
    return makeResponse(res, response);
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
  @ApiOperation({
    summary: 'returns images against a product',
  })
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

  @Get('/api/v1/products/mapping')
  @ApiOperation({
    summary:
      'returns mappings against given b2b product ids from elastic search',
  })
  async getProductMappings(
    @Res() res,
    @Query() filter: GetMappingDto,
  ): Promise<any> {
    return makeResponse(res, await this.appService.getProductMappings(filter));
  }

  @Get('/api/v1/products/more/like/this')
  @ApiOperation({
    summary: 'return products more like given product id from elastic search',
  })
  async getMoreLikeThis(
    @Res() res,
    @Query() filter: GetMoreLikeThisDto,
  ): Promise<any> {
    return makeResponse(res, await this.appService.getMoreLikeThis(filter));
  }

  addToCache(key: string, response: SuccessResponseType) {
    if (response.status === HttpStatus.OK) {
      this.cacheManager.set(key, response, CATEGORIES_CACHE, 6400);
    }
  }

  /**
   * this api re validates cache, we are using this until we have valid eviction policy for products list
   */
  async revalidateProductsCache(key: string, filter: ProductFilterDto) {
    try {
      this.logger.log('revalidateProductsCache', filter);
      const { storeId, collections, type } = filter;
      let response;
      if (storeId) {
        response = await this.appService.getShopProducts(filter);
      } else if (collections) {
        response = await this.appService.getProductByCollections(filter);
      } else {
        const typeMethod =
          {
            [ProductFilterTypeEnum.POPULAR_ITEMS]:
              this.appService.getPopularItems,
            [ProductFilterTypeEnum.NEW_ARRIVALS]: this.appService.getProducts,
          }[type] || this.appService.getProducts;

        response = await typeMethod.call(this.appService, filter);
      }
      this.addToCache(key, response);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Get('/api/v1/products/count')
  @ApiOperation({
    summary: 'return products more like given product id from elastic search',
  })
  async getProductsTotalCount(
    @Res() res,
    @Query() filter: ProductFilterDto,
  ): Promise<any> {
    return makeResponse(
      res,
      await this.appService.getProductsTotalCount(filter),
    );
  }
}
