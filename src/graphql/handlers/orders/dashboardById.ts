import { request } from 'graphql-request';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';
import { dashboardQuery } from '../../queries/orders/dashboardById';

export const dashboardByIdHandler = async () => {
  let dashboardData = {};
  await request(graphqlEndpoint(), dashboardQuery())
    .then((data) => {
      dashboardData = data;
    })
    .catch(() => console.log('graphql error'));
  return dashboardData;
};
