import { Injectable } from '@nestjs/common';
import { MenuCategoriesHandler } from '../../graphql/handlers/Categories/menuCategoriesHandler';
import { productCardCollectionHandler } from '../../graphql/handlers/Categories/productCollectionHandler';

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
