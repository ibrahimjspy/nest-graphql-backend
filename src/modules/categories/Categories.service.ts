import { Injectable } from '@nestjs/common';
import { menuCategoriesHandler } from 'src/graphql/handlers/categories/menuCategories';
import { productCardCollectionHandler } from 'src/graphql/handlers/categories/productCollections';

@Injectable()
export class CategoriesService {
  public getMenuCategories(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return menuCategoriesHandler();
  }
  public getProductCollections(): Promise<object> {
    // Pre graphQl call actions and validations to get product collection categories  -->
    // << -- >>
    // productCardCollectionHandler is graphQl promise handler --->
    return productCardCollectionHandler();
  }
}
