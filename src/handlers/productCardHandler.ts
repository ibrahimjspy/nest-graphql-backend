import { request } from 'graphql-request';
import { mockProductCard } from '../queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product card GraphQL handlers

export const productCardHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT;
  let productCardsData = {};
  await request(GRAPHQL_ENDPOINT, mockProductCard()).then((data) => {
    productCardsData = data;
  });
  return productCardsData;
};
