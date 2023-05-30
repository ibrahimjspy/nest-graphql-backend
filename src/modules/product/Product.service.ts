import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { ProductFilterDto } from './dto';
import * as ProductsHandlers from 'src/graphql/handlers/product';
import { downloadProductImagesHandler } from 'src/external/services/downloadImages';
import { getB2cProductMapping } from 'src/external/endpoints/b2cMapping';
import {
  getProductIds,
  getProductIdsByVariants,
  getShopProductIds,
  isEmptyArray,
  makeGetBundlesResponse,
  mergeB2cMappingsWithProductData,
  storeB2cMapping,
} from './Product.utils';
import { GetBundlesDto, ProductDetailsDto } from './dto/product.dto';
import {
  BundleCreateResponseType,
  BundlesResponseType,
  BundlesType,
  GetBundleResponseType,
  MarketplaceProductsResponseType,
  ProductDetailType,
} from './Product.types';
import { BundleCreateDto } from './dto/bundle';
import { UpdateOpenPackDto } from '../checkout/cart/dto/cart';
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
          productIds: uniqueProductIds,
        }),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getProductDetails(
    filter: ProductDetailsDto,
  ): Promise<ProductDetailType> {
    try {
      return prepareSuccessResponse(
        await ProductsHandlers.getProductDetailsHandler(filter, filter.isB2c),
      ) as unknown as ProductDetailType;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
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
      return mergeB2cMappingsWithProductData(productIdsMapping, productsData);
    } catch (error) {
      this.logger.error(error);
    }
  }
  /**
   * Get product bundles based on the provided filter.
   * @param filter - The filter parameters for retrieving bundles.
   * @returns {Promise<BundlesResponseType>} - The product bundles.
   */
  public async getProductBundles(
    filter: GetBundlesDto,
  ): Promise<BundlesResponseType> {
    try {
      const { productId } = filter;

      // Retrieve product details
      const [productDetails, bundleDetails] = await Promise.all([
        this.getProductDetails({
          productId,
        }),
        prepareSuccessResponse(
          await ProductsHandlers.getBundlesHandler(filter),
        ) as unknown as BundlesType,
      ]);

      // Combine product details and bundle details
      return makeGetBundlesResponse(productDetails, bundleDetails);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShopProducts(filter: ProductFilterDto): Promise<object> {
    try {
      const marketplace: MarketplaceProductsResponseType =
        await ProductsHandlers.getShopProductsHandler({
          ...filter,
        });
      const productIds = getShopProductIds(marketplace);
      if (isEmptyArray(productIds)) {
        const saleor = await ProductsHandlers.productsHandler({
          first: filter.first,
          productIds: productIds,
        });
        return prepareSuccessResponse({
          marketplace,
          saleor,
        });
      }
      return prepareSuccessResponse(
        { marketplace },
        'No products exists against shop category',
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async createBundle(
    bundleCreateInput: BundleCreateDto,
  ): Promise<BundleCreateResponseType> {
    try {
      return prepareSuccessResponse(
        await ProductsHandlers.createBundleHandler(bundleCreateInput),
      ) as unknown as BundleCreateResponseType;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async updateBundle(
    bundleUpdateInput: UpdateOpenPackDto,
  ): Promise<BundleCreateResponseType> {
    try {
      const updateBundle = await ProductsHandlers.updateBundleHandler(
        bundleUpdateInput,
      );
      ProductsHandlers.updateBundlePricingHandler(bundleUpdateInput.bundleId);
      return prepareSuccessResponse(
        updateBundle,
      ) as unknown as BundleCreateResponseType;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getBundle(id: string): Promise<GetBundleResponseType> {
    try {
      return prepareSuccessResponse(
        await ProductsHandlers.getBundleHandler(id),
      ) as unknown as GetBundleResponseType;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
