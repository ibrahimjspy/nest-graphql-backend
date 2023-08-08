import { Controller, Get, Logger, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { makeResponse } from 'src/core/utils/response';
import { CategoriesService } from './Categories.service';
import {
  CategoriesDto,
  SyncCategoriesDto,
  VendorCategoriesDto,
  shopIdDTO,
} from './dto/categories';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { CachingService } from 'src/app.cache.service';

@ApiTags('categories')
@Controller('')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(
    private readonly appService: CategoriesService,
    private readonly cacheManager: CachingService,
  ) {}

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
    const categoriesCacheKey = `categories_menu`;
    const cachedCategories = await this.cacheManager.get(categoriesCacheKey);

    if (cachedCategories) {
      this.logger.verbose('found cached categories');
      return cachedCategories;
    }
    this.logger.log(`Making expensive call to fetch categories`);
    const categoriesData = await this.appService.menuCategoriesDeprecated();
    const response = categoriesData['data'];
    this.cacheManager.set(categoriesCacheKey, response);
    return response;
  }

  @Get('api/v1/categories/menu')
  @ApiOperation({
    summary: 'returns vendor categories by shop id',
  })
  async findVendorCategories(
    @Res() res,
    @Query() filter: VendorCategoriesDto,
  ): Promise<object> {
    return makeResponse(res, await this.appService.getVendorCategories(filter));
  }

  @Get('/api/v1/collections')
  @ApiOperation({
    summary: 'this api returns collections from saleor',
  })
  async findCollections(
    @Res() res,
    @Query() filter: PaginationDto,
  ): Promise<object> {
    const collectionsCacheKey = `categories_collections_${JSON.stringify(
      filter,
    )}`;
    const cachedCollections = await this.cacheManager.get(collectionsCacheKey);
    if (cachedCollections) {
      this.logger.verbose('found cached categories');
      return cachedCollections;
    }
    this.logger.log(`Making expensive call to fetch collections`);
    const response = makeResponse(
      res,
      await this.appService.getCollections(filter),
    );
    this.cacheManager.set(collectionsCacheKey, response);
    return response;
  }
}
