import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { graphqlObjectTransform } from 'src/core/utils/helpers';

const b2bQuery = (after: string, metadata = []): string => {
  return gql`
    query {
      orders(first: 100, after: "${after}", filter: { metadata: ${graphqlObjectTransform(
    metadata,
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

const b2cQuery = b2bQuery;

export const getOrderStatus = (after = '', metadata = [], isB2C = false) => {
  return graphqlQueryCheck(
    b2bQuery(after, metadata),
    b2cQuery(after, metadata),
    isB2C,
  );
};
