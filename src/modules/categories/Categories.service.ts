import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  categoriesHandler,
  shopCategoryIdsHandler,
  syncCategoriesHandler,
} from 'src/graphql/handlers/categories';
import { CategoriesDto, SyncCategoriesDto } from './dto/categories';
import { getSyncCategoriesMapping } from 'src/external/endpoints/syncCategoriesMapping';
import {
  prepareSyncedCategoriesResponse,
  validateCategoriesResponse,
} from './Categories.utils';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

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
        const saleor = await categoriesHandler({ ...filter, categoryIds });
        return prepareSuccessResponse({
          marketplace,
          saleor,
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
}
