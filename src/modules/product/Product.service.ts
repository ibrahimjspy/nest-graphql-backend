import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareGQLPaginatedResponse } from 'src/core/utils/response';
import { ProductFilterDto } from './dto';
import * as ProductsHandlers from 'src/graphql/handlers/product';
import * as ProductUtils from './Product.utils';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  /**
   * Get products list from PIM
   * @returns products list
   */
  public async getProducts(filter: ProductFilterDto): Promise<object> {
    try {
      return prepareGQLPaginatedResponse(
        await ProductsHandlers.productsHandler(filter),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getPopularItems(filter: ProductFilterDto): Promise<object> {
    try {
      const popularItems = await ProductsHandlers.popularItemsHandler(filter);
      const productIds = ProductUtils.getProductIdsByVariants(popularItems);

      return prepareGQLPaginatedResponse(
        await ProductsHandlers.productsHandler({
          ...filter,
          ids: productIds,
        }),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * default product cards service
   * DEPRECATED: use `getProducts` method instead
   * @returns
   */
  public getProductCards(): Promise<object> {
    return ProductsHandlers.productCardHandler();
  }

  //Product cards by collection ~ category <id>
  public getProductsByCategory(id: string): Promise<object> {
    return ProductsHandlers.productCardsByCategoriesHandler(id);
  }

  // Single product details by <slug> {Quick View , SingleProductDetailsPage}
  public getProductDetailsBySlug(slug: string): Promise<object> {
    return ProductsHandlers.singleProductDetailsHandler(slug);
  }

  // Product list page data relating to category <slug>
  public getProductListPageById(id: string): Promise<object> {
    return ProductsHandlers.productListPageHandler(id);
  }

  // Bundles list relating to variant ids
  public getBundlesByVariantIds(variantIds: Array<string>): Promise<object> {
    return ProductsHandlers.bundlesByVariantsIdsHandler(variantIds);
  }
}
