import { Injectable } from '@nestjs/common';
import { MenuCategoriesHandler } from '../../graphql/handlers/categories/menuCategoriesHandler';
import { productCardCollectionHandler } from '../../graphql/handlers/categories/productCollectionHandler';

@Injectable()
export class CategoriesService {
  public getCategories(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return MenuCategoriesHandler();
  }
  public getCollections(): Promise<object> {
    // Pre graphQl call actions and validations to get product collection categories  -->
    // << -- >>
    // productCardCollectionHandler is graphQl promise handler --->
    return productCardCollectionHandler();
  }
}
