import { request } from 'graphql-request';
import { productDetailsQuery } from '../../queries/product/productDetails';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';

export const singleProductDetailsHandler = async () => {
  let singleProductData = {};
  await request(graphqlEndpoint(), productDetailsQuery())
    .then((data) => {
      singleProductData = data;
    })
    .catch(() => console.log('graphql error'));
  return singleProductData;
};
