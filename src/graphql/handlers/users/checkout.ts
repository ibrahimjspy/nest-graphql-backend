import { checkoutQuery } from 'src/graphql/queries/users/checkout';
import { graphqlCall } from 'src/public/graphqlHandler';

export const checkoutHandler = async (): Promise<object> => {
  return await graphqlCall(checkoutQuery(), 'true');
};
