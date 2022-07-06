import { request } from 'graphql-request';
import { MockSingleProduct } from 'src/queries/mock';

export const singleProductHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT;
  let singleProductData = {};
  await request(GRAPHQL_ENDPOINT, MockSingleProduct()).then((data) => {
    singleProductData = data;
  });
  return singleProductData;
};
