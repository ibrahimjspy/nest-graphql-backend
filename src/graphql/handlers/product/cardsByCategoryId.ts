import { productCardsByListIdQuery } from 'src/graphql/queries/product/cardsByCategoryId';
import { graphqlCall } from 'src/public/graphqlHandler';

export const productCardsByCategoriesHandler = async (
  id: string,
): Promise<object> => {
  return graphqlCall(productCardsByListIdQuery(id));
};
