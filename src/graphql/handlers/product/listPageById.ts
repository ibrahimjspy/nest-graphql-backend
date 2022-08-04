import { productListPageQuery } from 'src/graphql/queries/product/listPageById';
import { graphqlCall } from 'src/public/graphqlHandler';

export const productListPageHandler = async (id: string): Promise<object> => {
  return graphqlCall(productListPageQuery(id));
};
