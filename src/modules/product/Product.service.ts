import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareProductsSuccessResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { ProductFilterDto } from './dto';
import * as ProductsHandlers from 'src/graphql/handlers/product';
import { downloadProductImagesHandler } from 'src/external/services/downloadImages';
import { getB2cProductMapping } from 'src/external/endpoints/b2cMapping';
import {
  getProductIds,
  getShopProductIds,
  isEmptyArray,
  makeGetBundlesResponse,
  mergeB2cMappingsWithProductData,
  storeB2cMapping,
} from './Product.utils';
import {
  GetBundlesDto,
  GetMoreLikeThisDto,
  ProductDetailsDto,
  ProductFilterTypeEnum,
} from './dto/product.dto';
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
import { getOsProductMappingV2 } from 'src/external/endpoints/b2bMapping';
import { GetMappingDto } from '../shop/dto/shop';
import SearchService from 'src/external/services/search';
import { getAttributeHandler } from 'src/graphql/handlers/attribute';
import { getCollectionProductsHandler } from 'src/graphql/handlers/product';
import { SuccessResponseType } from 'src/core/utils/response.type';
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(private readonly searchService: SearchService) {
    return;
  }
  /**
   * Get products list from PIM
   * @returns products list
   */
  public async getProducts(filter: ProductFilterDto): Promise<object> {
    try {
      const retailerId = filter.retailerId;
      this.logger.log('Fetching products data', JSON.stringify(filter));
      const productsData = await ProductsHandlers.productsHandler(filter);
      const productsResponse = prepareProductsSuccessResponse(productsData);

      return prepareGQLPaginatedResponse(
        await this.addProductsMapping(productsResponse, retailerId),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * fetches popular items based on popularity attribute imported from os
   * slug of popular items is currently -- 'sixty-days-popularity'
   * @param {ProductFilterDto} filter - filters for products
   */
  public async getPopularItems(filter: ProductFilterDto): Promise<object> {
    try {
      const POPULARITY_ATTRIBUTE_SLUG = 'sixty-days-popularity';
      const attributeId = await this.getAttributeIdBySlug(
        POPULARITY_ATTRIBUTE_SLUG,
      );

      this.logger.log('fetching popular products', attributeId);
      return prepareGQLPaginatedResponse(
        await ProductsHandlers.productsHandler({
          ...filter,
          popularityAttributeId: attributeId,
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
      this.logger.log(
        `Adding variant stock against ${productVariantId}`,
        quantity,
      );
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

      // Returning only bundle detail if no product details are asked
      if (!filter.getProductDetails) {
        return prepareSuccessResponse(
          await ProductsHandlers.getBundlesHandler(filter),
        ) as unknown as BundlesResponseType;
      }
      // Retrieve product details
      const [productDetails, bundleDetails] = await Promise.all([
        this.getProductDetails({
          productId,
        }),
        prepareSuccessResponse(
          await ProductsHandlers.getBundlesHandler(filter),
        ) as unknown as BundlesType,
      ]);

      this.logger.log('Merging bundles to make response', [
        productDetails,
        bundleDetails,
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
      this.logger.log('Creating bundle', bundleCreateInput);
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
      this.logger.log('Updating bundle', bundleUpdateInput);

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
    return prepareSuccessResponse(
      await ProductsHandlers.getBundleHandler(id),
    ) as unknown as GetBundleResponseType;
  }

  public async getProductMappings(filter: GetMappingDto): Promise<object> {
    try {
      return prepareSuccessResponse(await getOsProductMappingV2(filter));
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getMoreLikeThis(filter: GetMoreLikeThisDto): Promise<object> {
    try {
      return prepareSuccessResponse(
        await this.searchService.getMoreLikeThis(filter),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * Fetches the attribute ID based on the provided slug.
   *
   * @param {string} slug - The slug of the attribute.
   * @returns {Promise<string>} - A promise that resolves to the attribute ID.
   */
  private async getAttributeIdBySlug(slug: string): Promise<string> {
    try {
      const attributeDetails = await getAttributeHandler(slug);
      return attributeDetails.id;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * Fetches products against collections and product filters
   *
   * @param {filters} filters - product filters to filter on
   * @returns {Promise<string>} - A promise that resolves to the attribute ID.
   */
  public async getProductByCollections(
    filter: ProductFilterDto,
  ): Promise<object> {
    try {
      this.logger.log(
        'fetching products by collections',
        JSON.stringify(filter),
      );
      const retailerId = filter.retailerId;
      const filteredProductsLength = filter.collections.length;
      const collectionProducts = await getCollectionProductsHandler(filter);

      if (filteredProductsLength == 1) {
        const firstCollectionProducts = collectionProducts['edges'].length
          ? collectionProducts['edges'][0]?.node?.products
          : [];
        const productsResponse = prepareProductsSuccessResponse(
          firstCollectionProducts,
        );
        return prepareGQLPaginatedResponse(
          await this.addProductsMapping(productsResponse, retailerId),
        );
      }
      return prepareSuccessResponse(collectionProducts);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
  public async getProductsTotalCount(
    filter: ProductFilterDto,
  ): Promise<SuccessResponseType> {
    try {
      console.log('fetching products total count');
      if (filter.type == ProductFilterTypeEnum.POPULAR_ITEMS) {
        const popularItems = await this.getPopularItems({
          ...filter,
          first: 1,
          after: null,
        });
        const popularItemsCount = popularItems['totalCount'] || 0;
        return prepareSuccessResponse(popularItemsCount);
      }
      if (filter.collections.length == 1) {
        const collectionItems = await this.getProductByCollections({
          ...filter,
          first: 1,
          after: null,
        });
        const collectionProductsCount = collectionItems['totalCount'] || 0;
        return prepareSuccessResponse(collectionProductsCount);
      }
      const productTotalCount = await ProductsHandlers.getProductsCountHandler(
        filter,
      );
      return prepareSuccessResponse(productTotalCount);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
