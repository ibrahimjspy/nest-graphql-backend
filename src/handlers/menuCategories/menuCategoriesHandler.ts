import { request } from 'graphql-request';
import { mockMenuCategories } from 'src/queries/mock';
// Menu categories graphql handlers <>
export const MenuCategoriesHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT;
  let menuCategoriesData = {};
  await request(GRAPHQL_ENDPOINT, mockMenuCategories()).then((data) => {
    menuCategoriesData = data;
  });
  return menuCategoriesData;
};
