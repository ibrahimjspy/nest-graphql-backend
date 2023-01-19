import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (after: string, storeOrderIds: string[]): string => {
  return gql`
    query {
      orders(first: 100, after: "${after}", filter: { ids: ${JSON.stringify(
    storeOrderIds,
  )} status: [] }) {
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

const b2cQuery = (after: string, storeOrderIds: string[]): string => {
  return gql`
    query {
      orders(first: 100, after: "${after}", filter: { ids: ${JSON.stringify(
    storeOrderIds,
  )} status: [] }) {
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

export const getOrderStatus = (after = '', storeOrderIds = [], isB2C = '') => {
  return graphqlQueryCheck(
    b2bQuery(after, storeOrderIds),
    b2cQuery(after, storeOrderIds),
    isB2C,
  );
};
