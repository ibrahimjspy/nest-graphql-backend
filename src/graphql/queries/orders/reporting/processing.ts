import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (): string => {
  return gql`
    query {
      orders(
        filter: {
          ids: []
          status: [
            READY_TO_FULFILL
            READY_TO_CAPTURE
            PARTIALLY_FULFILLED
            UNFULFILLED
          ]
        }
      ) {
        totalCount
      }
    }
  `;
};

const b2cQuery = (storeOrderIds: string[]): string => {
  return gql`
    query {
      orders(
        filter: {
          ids: ${JSON.stringify(storeOrderIds)}
          status: [
            READY_TO_FULFILL
            READY_TO_CAPTURE
            PARTIALLY_FULFILLED
            UNFULFILLED
          ]
        }
      ) {
        totalCount
      }
    }
  `;
};

export const getProcessingOrdersCountQuery = (
  storeOrderIds = [],
  isB2C = '',
) => {
  return graphqlQueryCheck(b2bQuery(), b2cQuery(storeOrderIds), isB2C);
};
