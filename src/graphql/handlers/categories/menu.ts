import { request } from 'graphql-request';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const menuCategoriesHandler = async (): Promise<object> => {
  let menuCategoriesData = {};
  await request(graphqlEndpoint(), menuCategoriesQuery())
    .then((data) => {
      menuCategoriesData = data;
    })
    .catch(() => {
      console.log('graphql error');
    });
  return menuCategoriesData;
};
