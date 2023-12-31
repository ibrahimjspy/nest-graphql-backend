import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  categoriesHandler,
  collectionsHandler,
  menuCategoriesHandler,
  shopCategoryIdsHandler,
  syncCategoriesHandler,
  vendorCategoriesHandler,
} from 'src/graphql/handlers/categories';
import {
  CategoriesDto,
  SyncCategoriesDto,
  VendorCategoriesDto,
} from './dto/categories';
import { getSyncCategoriesMapping } from 'src/external/endpoints/syncCategoriesMapping';
import {
  moveChildCategoriesToParents,
  prepareSyncedCategoriesResponse,
  updateNewArrivalCategoryChildren,
  validateCategoriesResponse,
} from './Categories.utils';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { SuccessResponseType } from 'src/core/utils/response.type';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  public async menuCategoriesDeprecated(): Promise<SuccessResponseType> {
    try {
      const categoriesResponse = validateCategoriesResponse(
        await menuCategoriesHandler(),
      );
      updateNewArrivalCategoryChildren(categoriesResponse);
      return prepareSuccessResponse(categoriesResponse);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getCategories(filter: CategoriesDto): Promise<object> {
    try {
      const categoriesResponse = validateCategoriesResponse(
        await categoriesHandler({ ...filter, categoryIds: [] }),
      );
      return prepareSuccessResponse(categoriesResponse);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getSyncedCategories(
    retailerId: string,
    syncCategoriesFilter: SyncCategoriesDto,
  ): Promise<object> {
    try {
      const categoriesData = await syncCategoriesHandler(syncCategoriesFilter);
      const syncedCategoriesMapping = await getSyncCategoriesMapping(
        retailerId,
      );
      return prepareSyncedCategoriesResponse(
        categoriesData,
        syncedCategoriesMapping,
      );
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  public async getShopCategories(
    shopId: string,
    filter: CategoriesDto,
  ): Promise<object> {
    try {
      const marketplace = await shopCategoryIdsHandler(shopId);
      const categoryIds = marketplace?.categoryIds || [];
      if (categoryIds.length) {
        this.logger.log(
          `Returning shop categories against ${shopId}`,
          marketplace,
        );
        const saleor = await categoriesHandler({ ...filter, categoryIds });
        const categories = moveChildCategoriesToParents(saleor);
        return prepareSuccessResponse({
          marketplace,
          saleor: categories,
        });
      }
      return prepareSuccessResponse(
        { marketplace },
        'No categories exists against shop',
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- returns first 20 categories also filters products total count by vendor using saleor metadata
   */
  public async getVendorCategories(
    filter: VendorCategoriesDto,
  ): Promise<object> {
    try {
      const categoriesResponse = await vendorCategoriesHandler(filter);
      return prepareSuccessResponse(categoriesResponse);
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  /**
   * @description -- returns collections from saleor
   */
  public async getCollections(
    pagination: PaginationDto,
  ): Promise<SuccessResponseType> {
    try {
      const collectionsResponse = await collectionsHandler(pagination);
      return await prepareSuccessResponse(collectionsResponse);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
