import * as ProductQueries from 'src/graphql/queries/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { getBundleIds } from 'src/modules/product/Product.utils';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { BundleType } from 'src/graphql/types/bundle.type';
import { BASE_EXTERNAL_ENDPOINT } from 'src/constants';
import http from 'src/core/proxies/restHandler';
import axios from 'axios';

export const productListPageHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productListPageQuery(id));
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const singleProductDetailsHandler = async (
  slug: string,
): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productDetailsQuery(slug));
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productCardsByCategoriesHandler = async (
  id: string,
): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productCardsByListIdQuery(id));
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productsHandler = async (filter): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productsQuery(filter)),
  );

  return response?.products;
};

export const popularItemsHandler = async (): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.popularItemsQuery()),
  );

  return response?.reportProductSales;
};

/**
 * DEPRECATED: use `productsHandler` method instead
 */
export const productCardHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productCardsDefaultQuery());
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const bundlesByVariantsIdsHandler = async (
  variantIds: Array<string>,
): Promise<Array<object>> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      ProductQueries.productBundlesByVariantIdQuery(variantIds),
    ),
  );
  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }
  return response['bundles'];
};

export const variantsIdsByProductIdsHandler = async (
  productIds: Array<string>,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.variantsIdsByProductIdsQuery(productIds)),
  );

  if (!response['products']?.['edges']?.['length']) {
    throw new RecordNotFound('Products');
  }

  return response['products'];
};

export const bundlesByBundleIdsHandler = async (
  bundles: Array<CheckoutBundleInputType>,
  token: string,
): Promise<BundleType[]> => {
  const bundleIds = getBundleIds(bundles);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      ProductQueries.productBundlesByBundleIdQuery(bundleIds),
      token,
    ),
  );

  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response['bundles'];
};

export const getLegacyMappingHandler = async (productIds, shop_ids) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productMappingQuery(productIds, shop_ids)),
  );
  return response;
};

export const downloadProductImagesHandler = async (urls: Array<string>) => {
  const payload = {
    urls,
  };
  console.log(JSON.stringify(payload));
  const URL =
    'https://b59mcfzou2.execute-api.us-west-2.amazonaws.com/production/download/';
  const response = await axios.post(URL, payload);
  console.log(JSON.stringify(response));
  return response;
};
