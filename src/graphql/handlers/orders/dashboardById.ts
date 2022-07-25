import { request } from 'graphql-request';
import { graphqlEndpoint } from '../../../public/graphqlEndpoint';
import { dashboardQuery } from '../../queries/orders/dashboardById';

export const dashboardByIdHandler = async () => {
  let dashboardData = {};
  await request(graphqlEndpoint(), dashboardQuery(3, 'false'))
    .then((data) => {
      dashboardData = data;
    })
    .catch(() => console.log('graphql error'));
  return dashboardData;
};
