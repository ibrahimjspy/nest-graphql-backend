import { gql } from 'graphql-request';

export const getOrdersCountQuery = () => {
  return gql`
    query {
      orders(last: 2, filter: { status: [] }) {
        totalCount
      }
    }
  `;
};
