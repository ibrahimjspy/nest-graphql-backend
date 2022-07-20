import { request } from 'graphql-request';
import { MockSingleProduct } from '../../queries/mock';

// Product list page handler

export const productListPageHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT || TEST;
  let productListPageData = {};
  await request(GRAPHQL_ENDPOINT, MockSingleProduct())
    .then((data) => {
      productListPageData = data;
    })
    .catch(() => console.log('graphql error'));
  return productListPageData;
};
// Endpoint for unit testing locally <JEST|ARTILLERY>
const TEST = 'http://localhost:4000/';
