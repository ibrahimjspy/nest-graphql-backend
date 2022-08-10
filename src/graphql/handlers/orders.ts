import { dashboardQuery } from 'src/graphql/queries/orders/dashboardById';
import { graphqlCall } from 'src/public/graphqlHandler';

export const dashboardByIdHandler = (id: string): Promise<object> => {
  return graphqlCall(dashboardQuery(id), 'true');
};
