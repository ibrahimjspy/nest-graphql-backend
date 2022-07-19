import { Injectable } from '@nestjs/common';
import { singleProductDetailsHandler } from '../../graphql/handlers/product/singleProductDetails';
import { productCardHandler } from '../../graphql/handlers/product/defaultProductCards';

@Injectable()
export class ProductService {
  // default product cards service
  public getProducts(): Promise<object> {
    return productCardHandler(); //graphQl promise handler
  }
  //Product cards by collection ~ category <id>
  public getProductsByCollections(id: string): Promise<object> {
    console.log(id ? id : 'not found');
    return productCardHandler(); //graphQl promise handler
  }
  // Single product by <slug> {Quick View , SingleProductDetailsPage}
  public getProductById(slug: string): Promise<object> {
    console.log(slug ? slug : 'not found');
    return singleProductDetailsHandler(); //graphQl promise handler
  }
}
