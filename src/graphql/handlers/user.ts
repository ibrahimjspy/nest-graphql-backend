import { graphqlCall } from 'src/public/graphqlHandler';
import { checkoutQuery } from 'src/graphql/queries/users/checkout';
import { shoppingCartQuery } from 'src/graphql/queries/users/shoppingCart';

export const checkoutHandler = async (id: string): Promise<object> => {
  return graphqlCall(checkoutQuery(id), 'true');
};

export const shoppingCartHandler = (id: string): Promise<object> => {
  return graphqlCall(shoppingCartQuery(id), 'true');
};
