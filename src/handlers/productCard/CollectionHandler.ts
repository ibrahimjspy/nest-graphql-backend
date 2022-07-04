import { request } from 'graphql-request';
import { CardCollection } from '../../queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product Collections GraphQL handlers

export const productCardCollectionHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT;
  let productCardsData = {};
  await request(GRAPHQL_ENDPOINT, CardCollection()).then((data) => {
    productCardsData = data;
  });
  return productCardsData;
};
