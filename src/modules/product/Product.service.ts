import { Injectable } from '@nestjs/common';
import { productCardHandler } from 'src/graphql/handlers/product/cards';
import { productListPageHandler } from 'src/graphql/handlers/product/listPageBySlug';
import { singleProductDetailsHandler } from 'src/graphql/handlers/product/detailsBySlug';
import { productCardsByCategoriesHandler } from 'src/graphql/handlers/product/cardsByCategoryId';

@Injectable()
export class ProductService {
  // default product cards service
  public getProducts(): Promise<object> {
    return productCardHandler();
  }
  //Product cards by collection ~ category <id>
  public getProductsByCollections(id: string): Promise<object> {
    console.log(id ? id : 'not found');
    return productCardsByCategoriesHandler(id);
  }
  // Single product details by <slug> {Quick View , SingleProductDetailsPage}
  public getProductDetailsBySlug(slug: string): Promise<object> {
    console.log(slug ? slug : 'not found');
    return singleProductDetailsHandler(slug);
  }
  // Product list page data relating to category <slug>
  public getProductListPageBySlug(slug: string): Promise<object> {
    console.log(slug ? slug : 'not found');
    return productListPageHandler(slug);
  }
}
