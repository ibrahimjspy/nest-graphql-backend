import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  categoriesHandler,
  menuCategoriesHandler,
  productCardSectionHandler,
  shopCategoryIdsHandler,
} from 'src/graphql/handlers/categories';
import { shopCategoriesDTO } from './dto/categories';

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

  public async getShopCategories(
    shopId: string,
    filter: shopCategoriesDTO,
  ): Promise<object> {
    try {
      const categoryIdsResponse = await shopCategoryIdsHandler(
        shopId,
        filter.isB2c,
      );
      const categoryIds = categoryIdsResponse?.categoryIds || [];
      if (categoryIds.length) {
        const response = await categoriesHandler(
          { ...filter, categoryIds },
          filter.isB2c,
        );
        return prepareSuccessResponse(response);
      }
      return prepareFailedResponse('Categories not found', 404);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
