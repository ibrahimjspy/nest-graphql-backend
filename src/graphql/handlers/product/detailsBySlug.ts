import { request } from 'graphql-request';
import { productDetailsQuery } from 'src/graphql/queries/product/detailsBySlug';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const singleProductDetailsHandler = async (slug): Promise<object> => {
  let singleProductData = {};
  await request(graphqlEndpoint(), productDetailsQuery(slug))
    .then((data) => {
      singleProductData = data;
    })
    .catch(() => console.log('graphql error'));
  return singleProductData;
};
