import { request } from 'graphql-request';
import { productListPageQuery } from 'src/graphql/queries/product/listPageByID';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const productListPageHandler = async (): Promise<object> => {
  let productListPageData = {};
  await request(graphqlEndpoint(), productListPageQuery())
    .then((data) => {
      productListPageData = data;
    })
    .catch(() => console.log('graphql error'));
  return productListPageData;
};
