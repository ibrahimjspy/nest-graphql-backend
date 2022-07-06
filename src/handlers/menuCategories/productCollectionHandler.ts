import { request } from 'graphql-request';
import { MockCardCollection } from '../../queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product Collections GraphQL handlers

export const productCardCollectionHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT;
  let CollectionsData = {};
  await request(GRAPHQL_ENDPOINT, MockCardCollection()).then((data) => {
    CollectionsData = data;
  });
  return CollectionsData;
};
