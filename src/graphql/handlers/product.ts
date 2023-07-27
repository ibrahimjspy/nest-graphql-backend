import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { BundleType } from 'src/graphql/types/bundle.type';
import { getMyProductsQuery } from '../queries/product/myProducts';
import { deleteBulkProductsMutation } from '../mutations/product/bulkDelete';
import { productVariantStockUpdateMutation } from '../mutations/product/variantStockUpdate';
import {
  myProductsDTO,
  updateMyProductDTO,
} from 'src/modules/shop/dto/myProducts';
import { updateMyProductMutation } from '../mutations/product/updateMyProducts';
import { deleteBulkMediaMutation } from '../mutations/product/mediaBulkDelete';
import { shopProductIdsByCategoryIdQuery } from '../queries/product/shopProductIds';
import {
  GetBundlesDto,
  ProductDetailsDto,
  ProductFilterDto,
} from 'src/modules/product/dto/product.dto';
import { getBundlesQuery } from '../queries/product/getBundles';
import { getProductDetailsQuery } from '../queries/product/details';
import {
  MarketplaceProductsResponseType,
  PopularItemsInterface,
} from 'src/modules/product/Product.types';
import { popularItemsQuery } from '../queries/product/popularItems';
import { productsQuery } from '../queries/product/products';
import { BundleCreateDto } from 'src/modules/product/dto/bundle';
import { bundleCreateMutation } from '../mutations/product/bundleCreate';
import { UpdateOpenPackDto } from 'src/modules/checkout/cart/dto/cart';
import {
  bundleUpdateMutation,
  updateBundlePricingMutation,
} from '../mutations/product/bundleUpdate';
import { getBundleQuery } from '../queries/product/getBundle';
import {
  B2B_DEVELOPMENT_TOKEN,
  B2C_DEVELOPMENT_TOKEN,
  B2C_ENABLED,
} from 'src/constants';
import { getGraphqlAllAccessToken } from 'src/core/utils/helpers';
import { hasNextPage } from '../utils/orders';
import { getProductIdsByVariants } from 'src/modules/product/Product.utils';
import { Logger } from '@nestjs/common';

export const productsHandler = async (
  filter: ProductFilterDto,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(productsQuery(filter), getGraphqlAllAccessToken(true)), // We only need access token in b2c apis for now
  );
  return response?.products;
};

/**
 * Fetches popular product IDs recursively using GraphQL queries.
 * @param after - Cursor indicating the starting point for pagination (optional).
 * @param productIds - Accumulated array of product IDs (optional).
 * @returns Promise that resolves to an array of popular product IDs.
 */
export const popularItemsHandler = async (
  after = '',
  productIds: string[] = [],
): Promise<string[]> => {
  Logger.log('Fetching popular products', after);

  // Make a GraphQL query to fetch popular items
  const response = await graphqlCall(
    popularItemsQuery({ first: 100, after }),
    getGraphqlAllAccessToken(),
  );

  // Handle potential GraphQL errors and retrieve popular items data
  const popularItems = (await graphqlResultErrorHandler(
    response,
  )) as PopularItemsInterface;

  // Check if there is a next page for pagination
  const nextPage = hasNextPage(popularItems.reportProductSales.pageInfo);

  // Add product IDs from the current page to the accumulated array
  productIds = productIds.concat(
    getProductIdsByVariants(popularItems.reportProductSales),
  );

  // If there is a next page, recursively call the function with the next cursor and accumulated product IDs
  if (nextPage) {
    return popularItemsHandler(nextPage, productIds);
  }

  // Return the final array of popular product IDs
  return productIds;
};

export const getBundlesHandler = async (
  filter: GetBundlesDto,
): Promise<BundleType[]> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getBundlesQuery(filter)),
  );
  if (!response['bundles']['edges']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response['bundles'];
};

export const getMyProductsHandler = async (
  productIds: string[],
  filter: myProductsDTO,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      getMyProductsQuery(productIds, filter, true),
      getGraphqlAllAccessToken(true),
      true,
    ),
  );
  return response['products'];
};

export const deleteBulkProductHandler = async (
  productIds: string[],
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      deleteBulkProductsMutation(productIds, isb2c),
      token,
      isb2c,
    ),
  );
  return response['productBulkDelete'];
};

export const updateProductVariantStockHandler = async (
  productVariantId: string,
  quantity: number,
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      productVariantStockUpdateMutation(productVariantId, quantity),
      token,
      isb2c,
    ),
  );
  return response['productVariantStocksUpdate'];
};

export const updateMyProductHandler = async (
  productUpdateInput: updateMyProductDTO,
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      updateMyProductMutation(productUpdateInput, isb2c),
      token,
      isb2c,
    ),
  );
  return response['productUpdate'];
};

export const deleteBulkMediaHandler = async (
  mediaIds: string[],
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(deleteBulkMediaMutation(mediaIds, isb2c), token, isb2c),
  );
  return response['productMediaBulkDelete'];
};

export const getShopProductsHandler = async (
  filter: ProductFilterDto,
  isb2c = false,
): Promise<MarketplaceProductsResponseType> => {
  const userToken = '';
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      shopProductIdsByCategoryIdQuery(filter, isb2c),
      userToken,
      isb2c,
    ),
  );
  return response['getProductsByShop'];
};

export const getProductDetailsHandler = async (
  filter: ProductDetailsDto,
  isB2c = false,
): Promise<object> => {
  try {
    return await graphqlCall(
      getProductDetailsQuery(filter, isB2c),
      B2C_ENABLED ? B2C_DEVELOPMENT_TOKEN : B2B_DEVELOPMENT_TOKEN,
      isB2c,
    );
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const createBundleHandler = async (
  bundleCreateInput: BundleCreateDto,
): Promise<object> => {
  const response = await graphqlCall(bundleCreateMutation(bundleCreateInput));
  return response['createBundle'];
};

export const updateBundleHandler = async (
  bundleUpdate: UpdateOpenPackDto,
): Promise<object> => {
  const response = await graphqlCall(bundleUpdateMutation(bundleUpdate));
  return response['updateBundle'];
};

export const getBundleHandler = async (id: string): Promise<object> => {
  const response = await graphqlCall(
    getBundleQuery(id),
    getGraphqlAllAccessToken(), // TODO fix this
  );
  return response['bundle'];
};

export const updateBundlePricingHandler = async (
  id: string,
): Promise<object> => {
  const response = await graphqlCall(updateBundlePricingMutation(id));
  return response['updateBundlesPricing'];
};
