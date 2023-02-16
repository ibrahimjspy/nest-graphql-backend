import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
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
      // Get category ids against given shop id
      const categoryIdsResponse = await shopCategoryIdsHandler(
        shopId,
        filter.isB2c,
      );
      const categoryIds = categoryIdsResponse?.categoryIds || [];
      // Get categories list against given shop category ids
      const response = await categoriesHandler(
        categoryIds,
        filter,
        filter.isB2c,
      );
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
