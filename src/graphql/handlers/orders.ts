import { dashboardQuery } from 'src/graphql/queries/orders/dashboardById';
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
