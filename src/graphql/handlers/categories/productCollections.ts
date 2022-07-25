import { request } from 'graphql-request';
import { graphqlEndpoint } from 'src/public/graphqlEndpoint';
import { MockCardCollection } from '../../queries/mock';
// import { productCardQuery } from '../queries/productCard';

export const productCardCollectionHandler = async () => {
  let CollectionsData = {};
  await request(graphqlEndpoint(), MockCardCollection())
    .then((data) => {
      CollectionsData = data;
    })
    .catch(() => console.log('graphql error'));
  return CollectionsData;
};
