import { Injectable } from '@nestjs/common';
import { productCardHandler } from 'src/graphql/handlers/product/defaultProductCards';
import { productListPageHandler } from 'src/graphql/handlers/product/productListPage';
import { singleProductDetailsHandler } from 'src/graphql/handlers/product/singleProductDetails';

@Injectable()
export class ProductService {
  // default product cards service
  public getProducts(): Promise<object> {
    return productCardHandler();
  }
  //Product cards by collection ~ category <id>
  public getProductsByCollections(id: string): Promise<object> {
    console.log(id ? id : 'not found');
    return productCardHandler();
  }
  // Single product details by <slug> {Quick View , SingleProductDetailsPage}
  public getProductDetailsBySlug(slug: string): Promise<object> {
    console.log(slug ? slug : 'not found');
    return singleProductDetailsHandler();
  }
  // Product list page data relating to category <slug>
  public getProductListPageBySlug(slug: string): Promise<object> {
    console.log(slug ? slug : 'not found');
    return productListPageHandler();
  }
}
