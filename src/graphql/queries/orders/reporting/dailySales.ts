import { gql } from 'graphql-request';

export const dailySalesQuery = (reportingPeriod) => {
  return gql`
    query {
      ordersTotal(period: ${reportingPeriod}, channel: "default-channel") {
        gross {
          currency
          amount
        }
        net {
          currency
          amount
        }
      }
    }
  `;
};
