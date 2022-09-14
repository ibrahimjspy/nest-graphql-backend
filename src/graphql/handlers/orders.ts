import { dashboardQuery } from 'src/graphql/queries/orders/dashboardById';
import { shopOrdersQuery } from 'src/graphql/queries/orders/shopOrdersById';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';

export const dashboardByIdHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(dashboardQuery(id), 'true');
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
export const shopOrdersByIdHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(shopOrdersQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
