import { request } from 'graphql-request';
import { checkoutQuery } from 'src/graphql/queries/users/checkout';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const checkoutHandler = async (): Promise<object> => {
  let checkoutData = {};
  await request(graphqlEndpoint(), checkoutQuery())
    .then((data) => {
      checkoutData = data;
    })
    .catch(() => console.log('graphql error'));
  return checkoutData;
};
