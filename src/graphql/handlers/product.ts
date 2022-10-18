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
): Promise<BundleType[]> => {
  const bundleIds = getBundleIds(bundles);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productBundlesByBundleIdQuery(bundleIds)),
  );

  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response['bundles'];
};
