import { request } from 'graphql-request';
import { dashboardQuery } from 'src/graphql/queries/orders/dashboardById';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const dashboardByIdHandler = async (): Promise<object> => {
  let dashboardData = {};
  await request(graphqlEndpoint('true'), dashboardQuery())
    .then((data) => {
      dashboardData = data;
    })
    .catch(() => console.log('graphql error'));
  return dashboardData;
};
