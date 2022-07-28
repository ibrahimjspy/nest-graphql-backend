import { request } from 'graphql-request';
import { shoppingCart } from 'src/graphql/queries/users/shoppingCart';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const shoppingCartHandler = async (): Promise<object> => {
  let shoppingCartData = {};
  await request(graphqlEndpoint(), shoppingCart())
    .then((data) => {
      shoppingCartData = data;
    })
    .catch(() => console.log('graphql error'));
  return shoppingCartData;
};
