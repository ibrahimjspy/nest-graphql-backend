import * as _ from 'src/graphql/queries/product/index';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';

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
  const response = await graphqlCall(_.productBundlesQuery(variantIds));
  return response['bundles'];
};

export const variantsIdsByProductIdsHandler = async (
  productIds: Array<string>,
): Promise<object> => {
  const response = await graphqlCall(
    _.variantsIdsByProductIdsQuery(productIds),
  );
  return response['products'];
};
