import { Injectable } from '@nestjs/common';
import { MenuCategoriesHandler } from 'src/handlers/menuCategoriesHandler';
import { productCardCollectionHandler } from 'src/handlers/productCard/CollectionHandler';

@Injectable()
export class MenuCategoriesService {
  public getCategories(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return MenuCategoriesHandler();
  }
  public getCollections(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // productCardHandler is graphQl promise handler --->
    return productCardCollectionHandler();
  }
}
