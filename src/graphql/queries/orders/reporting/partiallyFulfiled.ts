import { gql } from 'graphql-request';

export const getPartiallyFulfilledOrdersCountQuery = () => {
  return gql`
    query {
      orders(last: 2, filter: { status: [PARTIALLY_FULFILLED] }) {
        totalCount
      }
    }
  `;
};
