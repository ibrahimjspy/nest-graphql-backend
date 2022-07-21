import { request } from 'graphql-request';
import { dashboardQuery } from '../../queries/orders/dashboardById';

export const dashboardByIdHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT || TEST;
  let dashboardData = {};
  await request(GRAPHQL_ENDPOINT, dashboardQuery())
    .then((data) => {
      dashboardData = data;
    })
    .catch(() => console.log('graphql error'));
  return dashboardData;
};
// Endpoint for unit testing locally <JEST|ARTILLERY>
const TEST = 'http://localhost:4000/';
