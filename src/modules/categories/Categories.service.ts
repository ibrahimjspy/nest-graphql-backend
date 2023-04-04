import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareFailedResponse, prepareSuccessResponse } from 'src/core/utils/response';
import {
  categoriesHandler,
  menuCategoriesHandler,
  productCardSectionHandler,
  shopCategoryIdsHandler,
  syncCategoriesHandler,
} from 'src/graphql/handlers/categories';
import { SyncCategoriesDto, shopCategoriesDTO } from './dto/categories';
import { getSyncCategories } from 'src/external/endpoints/syncCategoriesMapping';
import { prepareSyncedCategoriesResponse } from './Categories.utils';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  public getMenuCategories(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return menuCategoriesHandler();
  }

  public getProductSections(): Promise<object> {
    // Pre graphQl call actions and validations to get product collection categories  -->
    // << -- >>
    // productCardCollectionHandler is graphQl promise handler --->
    return productCardSectionHandler();
  }

  public async getSyncedCategories(
    retailerId: string,
    syncCategoriesFilter: SyncCategoriesDto,
  ): Promise<object> {
    try {
      const categoriesData = await syncCategoriesHandler(syncCategoriesFilter);
      const syncedCategoriesMapping = await getSyncCategories(retailerId);
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
    filter: shopCategoriesDTO,
  ): Promise<object> {
    try {
      const marketplace = await shopCategoryIdsHandler(shopId, filter.isB2c);
      const categoryIds = marketplace?.categoryIds || [];
      if (categoryIds.length) {
        const saleor = await categoriesHandler(
          { ...filter, categoryIds },
          filter.isB2c,
        );
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
