import { gql } from 'graphql-request';

export const getOrderStatus = (after = ''): string => {
  return gql`
    query {
      orders(first: 100, after: "${after}", filter: { status: [] }) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            status
          }
        }
      }
    }
  `;
};
