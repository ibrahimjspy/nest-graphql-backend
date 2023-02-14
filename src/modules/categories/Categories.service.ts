import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  menuCategoriesHandler,
  productCardSectionHandler,
  categoriesHandler,
  shopCategoryIdsHandler,
} from 'src/graphql/handlers/categories';

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

  public async getShopCategories(shopId: string, isb2c = false): Promise<object> {
    try {
      // Get category ids against given shop id
      const { categoryIds } = await shopCategoryIdsHandler(shopId, isb2c);
      // Get categories list against given shop category ids
      const response = await categoriesHandler((categoryIds || []), isb2c);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
