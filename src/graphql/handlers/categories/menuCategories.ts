import { request } from 'graphql-request';
import { menuCategoriesQuery } from '../../queries/categories/menu';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';

export const menuCategoriesHandler = async () => {
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
