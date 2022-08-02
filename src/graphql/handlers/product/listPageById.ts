import { request } from 'graphql-request';
import { productListPageQuery } from 'src/graphql/queries/product/listPageById';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const productListPageHandler = async (id): Promise<object> => {
  let productListPageData = {};
  await request(graphqlEndpoint(), productListPageQuery(id))
    .then((data) => {
      productListPageData = data;
    })
    .catch(() => console.log('graphql error'));
  return productListPageData;
};
