import { request } from 'graphql-request';
import { productListPageQuery } from 'src/graphql/queries/product/listPageBySlug';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const productListPageHandler = async (Slug): Promise<object> => {
  let productListPageData = {};
  await request(graphqlEndpoint(), productListPageQuery(Slug))
    .then((data) => {
      productListPageData = data;
    })
    .catch(() => console.log('graphql error'));
  return productListPageData;
};
