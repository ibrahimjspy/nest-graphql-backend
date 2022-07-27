import { request } from 'graphql-request';
import { addToCartQuery } from 'src/graphql/queries/users/addToCart';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const addToCartHandler = async (): Promise<object> => {
  let addToCartData = {};
  await request(graphqlEndpoint(), addToCartQuery())
    .then((data) => {
      addToCartData = data;
    })
    .catch(() => console.log('graphql error'));
  return addToCartData;
};
