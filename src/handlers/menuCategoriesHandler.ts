import { request } from 'graphql-request';
import { mockMenuCategories } from 'src/queries/mock';

export const MenuCategoriesHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT;
  let productCardsData = {};
  await request(GRAPHQL_ENDPOINT, mockMenuCategories()).then((data) => {
    productCardsData = data;
  });
  return productCardsData;
};
