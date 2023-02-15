import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { ProductFilterDto } from './dto';
import * as ProductsHandlers from 'src/graphql/handlers/product';
import { downloadProductImagesHandler } from 'src/external/services/download_images';
import { getB2cProductMapping } from 'src/external/endpoints/b2cMapping';
import {
  addB2cIdsToProductData,
  getProductIds,
  getProductIdsByVariants,
  makeProductListResponse,
  storeB2cMapping,
} from './Product.utils';
import { ProductListFilterDto, shopProductsDTO } from './dto/product.dto';
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  /**
   * Get products list from PIM
   * @returns products list
   */
  public async getProducts(filter: ProductFilterDto): Promise<object> {
    try {
      const retailerId = filter.retailerId;
      const productsData = await ProductsHandlers.productsHandler(filter);

      return prepareGQLPaginatedResponse(
        await this.addProductsMapping(productsData, retailerId),
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
      const uniqueProductIds = getProductIdsByVariants(popularItems);

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
  public async getProductCards(retailerId): Promise<object> {
    try {
      const productsData = await ProductsHandlers.productCardHandler();
      return makeProductListResponse(
        await this.addProductsMapping(productsData, retailerId),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  //Product cards by collection ~ category <id>
  public async getProductsByCategory(
    id: string,
    retailerId: string,
  ): Promise<object> {
    try {
      const productsData =
        await ProductsHandlers.productCardsByCategoriesHandler(id);
      return makeProductListResponse(
        await this.addProductsMapping(productsData, retailerId),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  // Single product details by <slug> {Quick View , SingleProductDetailsPage}
  public getProductDetailsBySlug(slug: string): Promise<object> {
    return ProductsHandlers.singleProductDetailsHandler(slug);
  }

  // Product list page data relating to category <slug>
  public async getProductListPageById(
    categoryId: string,
    filter: ProductListFilterDto,
  ): Promise<object> {
    try {
      const retailerId = filter.retailerId;
      const productIds = [];
      const productsData = await ProductsHandlers.productListPageHandler(
        categoryId,
        productIds,
        filter,
      );
      return prepareSuccessResponse(
        makeProductListResponse(
          await this.addProductsMapping(productsData, retailerId),
        ),
      );
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
  /**
   * @description this function adds b2c product ids against b2b products list
   * @link - getB2cProductMapping -- to fetch b2c productIds against a retailer id from elastic search mapping service
   */
  public async addProductsMapping(
    productsData,
    retailerId: string,
  ): Promise<object> {
    try {
      if (!retailerId) {
        // returns products list as it is if retailer id is not valid
        return productsData;
      }
      const b2bProductIds = getProductIds(productsData);
      const productIdsMapping = storeB2cMapping(
        await getB2cProductMapping(b2bProductIds, retailerId),
      );
      return addB2cIdsToProductData(productIdsMapping, productsData);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getShopProductsByCategoryId(shopId: string, filter: shopProductsDTO): Promise<object> {
    try {
      // Get product ids against given shopId and categoryId
      const productIdsResponse = await ProductsHandlers.shopProductIdsByCategoryIdHandler(shopId, filter.categoryId, filter.isB2c);
      const productIds = (productIdsResponse?.productIds || []);
      
      // Get products list against given shop productIds
      const response = await ProductsHandlers.productListPageHandler(filter.categoryId, productIds, filter, filter.isB2c);
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

}
