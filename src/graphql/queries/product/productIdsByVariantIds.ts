import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (variantsIds, after = ''): string => {
  return gql`
    query {
      productVariants(first: 100, after: "${after}", ids: ${JSON.stringify(
    variantsIds,
  )}) {
        pageInfo {
            hasNextPage
            endCursor
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

const b2cQuery = (variantsIds: string[], after = '') => {
  return gql`
    query {
      productVariants(first: 100, after: "${after}", ids: ${JSON.stringify(
    variantsIds,
  )}) {
       pageInfo {
        hasNextPage
        endCursor
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

export const getProductIdsByVariantIdsQuery = (
  variantsIds: string[],
  after = '',
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bQuery(variantsIds, after),
    b2cQuery(variantsIds, after),
    isb2c,
  );
};
