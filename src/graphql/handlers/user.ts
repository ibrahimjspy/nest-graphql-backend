import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { checkoutQuery } from 'src/graphql/queries/users/checkout';
import { shoppingCartQuery } from 'src/graphql/queries/users/shoppingCart';

export const checkoutHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(checkoutQuery(id), 'true');
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const shoppingCartHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(shoppingCartQuery(id), 'true');
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
