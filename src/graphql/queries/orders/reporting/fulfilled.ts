import { gql } from 'graphql-request';

export const getFulfilledOrdersCountQuery = () => {
  return gql`
    query {
      orders(last: 2, filter: { status: [FULFILLED] }) {
        totalCount
      }
    }
  `;
};
