import * as ProductQueries from 'src/graphql/queries/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { getBundleIds } from 'src/modules/product/Product.utils';
import { bundleTypes } from 'src/graphql/handlers/checkout.types';

export const productListPageHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productListPageQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const singleProductDetailsHandler = async (
  slug: string,
): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productDetailsQuery(slug));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const productCardsByCategoriesHandler = async (
  id: string,
): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productCardsByListIdQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const productCardHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productCardsDefaultQuery());
  } catch (err) {
    return graphqlExceptionHandler(err);
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
  bundles: Array<bundleTypes>,
): Promise<object> => {
  const bundleIds = getBundleIds(bundles);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productBundlesByBundleIdQuery(bundleIds)),
  );

  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response;
};
