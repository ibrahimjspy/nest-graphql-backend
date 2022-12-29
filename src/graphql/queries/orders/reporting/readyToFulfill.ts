import { gql } from 'graphql-request';

export const getReadyToFulfillOrdersCountQuery = () => {
  return gql`
    query {
      orders(last: 2, filter: { status: [READY_TO_FULFILL] }) {
        totalCount
      }
    }
  `;
};
