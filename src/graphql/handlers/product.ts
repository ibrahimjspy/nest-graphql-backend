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

export const productListPageHandler = async (
  id: string,
  header: string,
): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productListPageQuery(id), header);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const singleProductDetailsHandler = async (
  slug: string,
  header: string,
): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productDetailsQuery(slug), header);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productCardsByCategoriesHandler = async (
  id: string,
  header: string,
): Promise<object> => {
  try {
    return await graphqlCall(
      ProductQueries.productCardsByListIdQuery(id),
      header,
    );
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productsHandler = async (
  filter,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productsQuery(filter), header),
  );

  return response?.products;
};

export const popularItemsHandler = async (header: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.popularItemsQuery(), header),
  );

  return response?.reportProductSales;
};

/**
 * DEPRECATED: use `productsHandler` method instead
 */
export const productCardHandler = async (header: string): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productCardsDefaultQuery(), header);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const bundlesByVariantsIdsHandler = async (
  variantIds: Array<string>,
  header: string,
): Promise<Array<object>> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      ProductQueries.productBundlesByVariantIdQuery(variantIds),
      header,
    ),
  );
  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }
  return response['bundles'];
};

export const variantsIdsByProductIdsHandler = async (
  productIds: Array<string>,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      ProductQueries.variantsIdsByProductIdsQuery(productIds),
      header,
    ),
  );

  if (!response['products']?.['edges']?.['length']) {
    throw new RecordNotFound('Products');
  }

  return response['products'];
};

export const bundlesByBundleIdsHandler = async (
  bundles: Array<CheckoutBundleInputType>,
  header: string,
): Promise<BundleType[]> => {
  const bundleIds = getBundleIds(bundles);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      ProductQueries.productBundlesByBundleIdQuery(bundleIds),
      header,
    ),
  );

  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response['bundles'];
};
