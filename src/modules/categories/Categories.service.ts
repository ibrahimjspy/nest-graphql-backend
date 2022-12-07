import { Inject, Injectable } from '@nestjs/common';
import {
  menuCategoriesHandler,
  productCardSectionHandler,
} from 'src/graphql/handlers/categories';

@Injectable()
export class CategoriesService {
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
}
