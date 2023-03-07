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
      const shopCategoryIds = await shopCategoryIdsHandler(
        shopId,
        filter.isB2c,
      );
      const categoryIds = shopCategoryIds?.categoryIds || [];
      if (categoryIds.length) {
        const categoriesDetails = await categoriesHandler(
          { ...filter, categoryIds },
          filter.isB2c,
        );
        return prepareSuccessResponse({
          marketplace: { categoryIds },
          saleor: categoriesDetails,
        });
      }
      return prepareSuccessResponse(
        { marketplace: { categoryIds } },
        'No categories exists against shop',
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
