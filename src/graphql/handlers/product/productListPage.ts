import { request } from 'graphql-request';
import { productListPageQuery } from '../../queries/product/productList';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';

export const productListPageHandler = async () => {
  let productListPageData = {};
  await request(graphqlEndpoint(), productListPageQuery())
    .then((data) => {
      productListPageData = data;
    })
    .catch(() => console.log('graphql error'));
  return productListPageData;
};
