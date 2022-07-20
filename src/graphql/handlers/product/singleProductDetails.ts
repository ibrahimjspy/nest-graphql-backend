import { request } from 'graphql-request';
import { MockSingleProduct } from '../../queries/mock';

// Single product card details page ^^ QuickView graphql handler
export const singleProductDetailsHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT || TEST;
  let singleProductData = {};
  await request(GRAPHQL_ENDPOINT, MockSingleProduct()).then((data) => {
    singleProductData = data;
  });
  return singleProductData;
};
// Endpoint for unit testing locally <JEST|ARTILLERY>
const TEST = 'http://localhost:4000/';
