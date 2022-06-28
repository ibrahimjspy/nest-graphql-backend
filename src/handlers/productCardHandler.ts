import { request } from 'graphql-request';
import { mockProductCard } from '../queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product card GraphQL handlers

export const productCardHandler = async () => {
  let productCardsData = {};
  await request(process.env.MOCK_GRAPHQL_ENDPOINT, mockProductCard()).then(
    (data) => {
      productCardsData = data;
    },
  );
  return productCardsData;
};
