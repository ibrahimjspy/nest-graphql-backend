import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (): string => {
  return gql`
    query {
      orders(filter: { ids: [], status: CANCELED }) {
        totalCount
      }
    }
  `;
};

const b2cQuery = (storeOrderIds: string[]): string => {
  return gql`
    query {
      orders(filter: { ids: ${JSON.stringify(
        storeOrderIds,
      )}, status: CANCELED }) {
        totalCount
      }
    }
  `;
};

export const getCancelledOrdersCountQuery = (
  storeOrderIds = [],
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(), b2cQuery(storeOrderIds), isB2C);
};
