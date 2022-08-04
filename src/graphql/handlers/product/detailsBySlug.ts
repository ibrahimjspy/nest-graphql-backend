import { productDetailsQuery } from 'src/graphql/queries/product/detailsBySlug';
import { graphqlCall } from 'src/public/graphqlHandler';

export const singleProductDetailsHandler = async (
  slug: string,
): Promise<object> => {
  return graphqlCall(productDetailsQuery(slug));
};
