import { productDetailsQuery } from 'src/graphql/queries/product/detailsBySlug';
import { productCardsByListIdQuery } from 'src/graphql/queries/product/cardsByCategoryId';
import { productCardsDefaultQuery } from 'src/graphql/queries/product/cards';
import { productListPageQuery } from 'src/graphql/queries/product/listPageById';
import { graphqlCall } from 'src/public/graphqlHandler';

export const productListPageHandler = async (id: string): Promise<object> => {
  return graphqlCall(productListPageQuery(id));
};

export const singleProductDetailsHandler = async (
  slug: string,
): Promise<object> => {
  return graphqlCall(productDetailsQuery(slug));
};

export const productCardsByCategoriesHandler = async (
  id: string,
): Promise<object> => {
  return graphqlCall(productCardsByListIdQuery(id));
};

export const productCardHandler = async (): Promise<object> => {
  return graphqlCall(productCardsDefaultQuery());
};
