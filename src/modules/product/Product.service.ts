import { Injectable } from '@nestjs/common';
import { singleProductDetailsHandler } from '../../graphql/handlers/product/singleProductDetails';
import { productCardHandler } from '../../graphql/handlers/product/defaultProductCards';
import { productListPageHandler } from '../../graphql/handlers/product/productListPage';

@Injectable()
export class ProductService {
  // default product cards service
  public getProducts(): Promise<object> {
    return productCardHandler(); //graphQl promise handlernpm r
  }
  //Product cards by collection ~ category <id>
  public getProductsByCollections(id: string): Promise<object> {
    console.log(id ? id : 'not found');
    return productCardHandler(); //graphQl promise handler
  }
  // Single product details by <slug> {Quick View , SingleProductDetailsPage}
  public getProductDetailsBySlug(slug: string): Promise<object> {
    console.log(slug ? slug : 'not found');
    return singleProductDetailsHandler(); //graphQl promise handler
  }
  // Product list page data relating to category <slug>
  public getProductListPageBySlug(slug: string): Promise<object> {
    console.log(slug ? slug : 'not found');
    return productListPageHandler(); //graphQl promise handler
  }
}
