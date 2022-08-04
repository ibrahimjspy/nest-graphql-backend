import { dashboardQuery } from 'src/graphql/queries/orders/dashboardById';
import { graphqlCall } from 'src/public/graphqlHandler';

export const dashboardByIdHandler = async (id: string): Promise<object> => {
  return await graphqlCall(dashboardQuery(id), 'true');
};
