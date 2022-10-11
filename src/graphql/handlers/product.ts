import * as _ from 'src/graphql/queries/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/public/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { getBundleIds } from 'src/public/checkoutHelperFunctions';
import { BundleTypes } from 'src/graphql/handlers/checkout/Checkout.types';

export const productListPageHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(_.productListPageQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const singleProductDetailsHandler = async (
  slug: string,
): Promise<object> => {
  try {
    return await graphqlCall(_.productDetailsQuery(slug));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const productCardsByCategoriesHandler = async (
  id: string,
): Promise<object> => {
  try {
    return await graphqlCall(_.productCardsByListIdQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const productCardHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(_.productCardsDefaultQuery());
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const bundlesByVariantsIdsHandler = async (
  variantIds: Array<string>,
): Promise<Array<object>> => {
  try {
    const response = await graphqlCall(
      _.productBundlesByVariantIdQuery(variantIds),
    );
    return response['bundles'];
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const variantsIdsByProductIdsHandler = async (
  productIds: Array<string>,
): Promise<object> => {
  try {
    const response = await graphqlCall(
      _.variantsIdsByProductIdsQuery(productIds),
    );
    return response['products'];
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const bundlesByBundleIdsHandler = async (
  bundles: Array<BundleTypes>,
): Promise<object> => {
  const bundleIds = getBundleIds(bundles);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(_.productBundlesByBundleIdQuery(bundleIds)),
  );

  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response;
};
