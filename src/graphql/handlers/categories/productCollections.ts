import { request } from 'graphql-request';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';

export const productCardCollectionHandler = async () => {
  let CollectionsData = {};
  await request(graphqlEndpoint(), menuCategoriesQuery())
    .then((data) => {
      CollectionsData = data;
    })
    .catch(() => console.log('graphql error'));
  return CollectionsData;
};
