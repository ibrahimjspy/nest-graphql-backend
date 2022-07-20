import { request } from 'graphql-request';
import { mockMenuCategories } from '../../queries/mock';

// Menu categories graphql handlers <>

export const MenuCategoriesHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT || TEST;
  let menuCategoriesData = {};
  await request(GRAPHQL_ENDPOINT, mockMenuCategories())
    .then((data) => {
      menuCategoriesData = data;
    })
    .catch(() => console.log('graphql error'));
  return menuCategoriesData;
};
// Endpoint for unit testing locally <JEST|ARTILLERY>
const TEST = 'http://localhost:4000/';
