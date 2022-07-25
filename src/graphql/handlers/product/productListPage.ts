import { request } from 'graphql-request';
import { graphqlEndpoint } from '../../../public/graphqlEndpoint';
import { MockSingleProduct } from '../../queries/mock';

export const productListPageHandler = async () => {
  let productListPageData = {};
  await request(graphqlEndpoint(), MockSingleProduct())
    .then((data) => {
      productListPageData = data;
    })
    .catch(() => console.log('graphql error'));
  return productListPageData;
};
