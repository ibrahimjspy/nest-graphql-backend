import { request } from 'graphql-request';
import { graphqlEndpoint } from '../../../public/graphqlEndpoint';
import { MockSingleProduct } from '../../queries/mock';

export const singleProductDetailsHandler = async () => {
  let singleProductData = {};
  await request(graphqlEndpoint(), MockSingleProduct())
    .then((data) => {
      singleProductData = data;
    })
    .catch(() => console.log('graphql error'));
  return singleProductData;
};
