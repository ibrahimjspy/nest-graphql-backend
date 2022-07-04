import { Injectable } from '@nestjs/common';
import { productCardCollectionHandler } from 'src/handlers/productCard/CollectionHandler';
import { productCardHandler } from '../handlers/productCard/Handler';

@Injectable()
export class ProductCardService {
  public getProducts(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // productCardHandler is graphQl promise handler --->
    return productCardHandler();
  }
  public getCollections(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // productCardHandler is graphQl promise handler --->
    return productCardCollectionHandler();
  }
}
