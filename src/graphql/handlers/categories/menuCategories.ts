import { request } from 'graphql-request';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';
import { mockMenuCategories } from '../../queries/mock';

export const MenuCategoriesHandler = async () => {
  let menuCategoriesData = {};
  await request(graphqlEndpoint(), mockMenuCategories())
    .then((data) => {
      menuCategoriesData = data;
    })
    .catch(() => console.log('graphql error'));
  return menuCategoriesData;
};
