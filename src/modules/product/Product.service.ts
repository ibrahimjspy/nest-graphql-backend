import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { ProductFilterDto } from './dto';
import * as ProductsHandlers from 'src/graphql/handlers/product';
import * as ProductUtils from './Product.utils';
import { downloadProductImagesHandler } from 'src/external/services/download_images';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
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

  /**
   * // FIXME: Need to create custom solution, due to Saleor is providing product-variants as
   * popular items and we need to show products and its breaking the pagination.
   *
   * It gets the popular items from the database, gets the product ids from the variants, and then gets
   * the products from the database
   * @param {ProductFilterDto} filter - filters for products
   */
  public async getPopularItems(filter: ProductFilterDto): Promise<object> {
    try {
      const popularItems = await ProductsHandlers.popularItemsHandler();
      const uniqueProductIds =
        ProductUtils.getProductIdsByVariants(popularItems);

      return prepareGQLPaginatedResponse(
        await ProductsHandlers.productsHandler({
          ...filter,
          ids: uniqueProductIds,
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
  public async getProductListPageById(
    id: string,
    pagination: PaginationDto,
  ): Promise<object> {
    try {
      const response = await ProductsHandlers.productListPageHandler(
        id,
        pagination,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Bundles list relating to variant ids
  public getBundlesByVariantIds(variantIds: Array<string>): Promise<object> {
    return ProductsHandlers.bundlesByVariantsIdsHandler(variantIds);
  }

  // Return product images downloadable URL.
  public getDownloadProductImages(urls: Array<string>): Promise<object> {
    return downloadProductImagesHandler(urls);
  }

  public async updateProductVariantStock(
    productVariantId: string,
    quantity: number,
    token: string,
  ): Promise<object> {
    try {
      const response = await ProductsHandlers.updateProductVariantStockHandler(
        productVariantId,
        quantity,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
