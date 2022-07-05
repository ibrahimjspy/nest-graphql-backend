import { Injectable } from '@nestjs/common';
import { MenuCategoriesHandler } from 'src/handlers/menuCategories/menuCategoriesHandler';
import { productCardCollectionHandler } from 'src/handlers/menuCategories/CollectionHandler';

@Injectable()
export class MenuCategoriesService {
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
