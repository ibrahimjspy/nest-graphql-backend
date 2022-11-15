import { Injectable } from '@nestjs/common';
import {
  bundlesByVariantsIdsHandler,
  productCardHandler,
  productCardsByCategoriesHandler,
  productListPageHandler,
  singleProductDetailsHandler,
} from 'src/graphql/handlers/product';

@Injectable()
export class ProductService {
  // default product cards service
  public getProducts(): Promise<object> {
    return productCardHandler();
  }
  //Product cards by collection ~ category <id>
  public getProductsByCategory(id: string): Promise<object> {
    return productCardsByCategoriesHandler(id);
  }
  // Single product details by <slug> {Quick View , SingleProductDetailsPage}
  public getProductDetailsBySlug(slug: string): Promise<object> {
    return singleProductDetailsHandler(slug);
  }
  // Product list page data relating to category <slug>
  public getProductListPageById(id: string): Promise<object> {
    return productListPageHandler(id);
  }
  // Bundles list relating to variant ids
  public getBundlesByVariantIds(variantIds: Array<string>): Promise<object> {
    return bundlesByVariantsIdsHandler(variantIds);
  }
}
