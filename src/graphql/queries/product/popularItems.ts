import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

/**
 * Query for Top selling products.
 * @returns {string} - query
 */
export const federationQuery = (): string => {
  return gql`
    query {
      reportProductSales(
        first: 100
        channel: "${DEFAULT_CHANNEL}"
        period: THIS_MONTH
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        edges {
          node {
            product {
              id
            }
          }
        }
      }
    }
  `;
};

export const popularItemsQuery = () => {
  const query = federationQuery();
  return graphqlQueryCheck(query, query);
};
