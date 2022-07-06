import { Injectable } from '@nestjs/common';
import { singleProductHandler } from 'src/handlers/productCard/singleProductDetails';
import { productCardHandler } from '../handlers/productCard/defaultProductCard';

@Injectable()
export class ProductCardService {
  // default product cards service
  public getProducts(): Promise<object> {
    return productCardHandler(); //graphQl promise handler
  }
  //Product cards by collection <id>
  public getProductsByCollections(id: string): Promise<object> {
    console.log(id);
    return productCardHandler(); //graphQl promise handler
  }
  // Single product by <slug> {Quick View}
  public getProductById(slug: string): Promise<object> {
    console.log(slug);
    return singleProductHandler(); //graphQl promise handler
  }
}
