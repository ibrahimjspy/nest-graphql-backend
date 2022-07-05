import { Injectable } from '@nestjs/common';
import { productCardHandler } from '../handlers/productCard/Handler';

@Injectable()
export class ProductCardService {
  public getProducts(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // productCardHandler is graphQl promise handler --->
    return productCardHandler();
  }
  public getProductsByCollections(id: string): Promise<object> {
    // Pre graphQl call actions and validations -->
    console.log(id);
    // productCardHandler is graphQl promise handler --->
    return productCardHandler();
  }
  // Single product by id
  public getProductById(id: string): Promise<object> {
    // Pre graphQl call actions and validations -->
    console.log(id);
    // productCardHandler is graphQl promise handler --->
    return productCardHandler();
  }
}
