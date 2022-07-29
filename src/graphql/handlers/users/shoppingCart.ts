import { request } from 'graphql-request';
import { shoppingCartQuery } from 'src/graphql/queries/users/shoppingCart';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const shoppingCartHandler = async (): Promise<object> => {
  let shoppingCartData = {};
  await request(graphqlEndpoint('true'), shoppingCartQuery())
    .then((data) => {
      shoppingCartData = data;
    })
    .catch(() => console.log('graphql error'));
  return shoppingCartData;
};
