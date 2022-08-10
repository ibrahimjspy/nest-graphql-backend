import { productDetailsQuery } from 'src/graphql/queries/product/detailsBySlug';
import { productCardsByListIdQuery } from 'src/graphql/queries/product/cardsByCategoryId';
import { productCardsDefaultQuery } from 'src/graphql/queries/product/cards';
import { productListPageQuery } from 'src/graphql/queries/product/listPageById';
import { graphqlCall } from 'src/public/graphqlHandler';

export const productListPageHandler = (id: string): Promise<object> => {
  return graphqlCall(productListPageQuery(id));
};

export const singleProductDetailsHandler = (slug: string): Promise<object> => {
  return graphqlCall(productDetailsQuery(slug));
};

export const productCardsByCategoriesHandler = (
  id: string,
): Promise<object> => {
  return graphqlCall(productCardsByListIdQuery(id));
};

export const productCardHandler = (): Promise<object> => {
  return graphqlCall(productCardsDefaultQuery());
};

// export const bundleServiceHandler = () => {
//   const productVariant = await graphqlCall(productVariantsQuery());
//   return graphqlCall(productBundleQuery(productVariant));
// };
