import { request } from 'graphql-request';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';
import { MockCardCollection } from '../../queries/mock';

export const productCardCollectionHandler = async () => {
  let CollectionsData = {};
  await request(graphqlEndpoint(), MockCardCollection())
    .then((data) => {
      CollectionsData = data;
    })
    .catch(() => console.log('graphql error'));
  return CollectionsData;
};
