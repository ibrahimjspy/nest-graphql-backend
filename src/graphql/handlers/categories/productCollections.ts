import { request } from 'graphql-request';
import { productCollectionsQuery } from 'src/graphql/queries/categories/productCollections';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const productCardCollectionHandler = async (): Promise<object> => {
  let CollectionsData = {};
  await request(graphqlEndpoint('true'), productCollectionsQuery())
    .then((data) => {
      CollectionsData = data;
    })
    .catch(() => console.log('graphql error'));
  return CollectionsData;
};
