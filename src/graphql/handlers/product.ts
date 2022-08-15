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

export const singleProductDetailsHandler = (slug: string): Promise<object> => {
  return graphqlCall(_.productDetailsQuery(slug));
};

export const productCardsByCategoriesHandler = (
  id: string,
): Promise<object> => {
  return graphqlCall(_.productCardsByListIdQuery(id));
};

export const productCardHandler = (): Promise<object> => {
  return graphqlCall(_.productCardsDefaultQuery());
};

// export const bundleServiceHandler = () => {
//   const productVariant = await graphqlCall(productVariantsQuery());
//   return graphqlCall(productBundleQuery(productVariant));
// };
