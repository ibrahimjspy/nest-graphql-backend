import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (): string => {
  return gql`
    query {
      sections {
        name
        categories {
          name
          id
          slug
          products(first: 6) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  `;
};

const mockQuery = (): string => {
  return gql`
    query {
      products_collection {
        id
        name
        related_categories {
          id
          name
          slug
        }
      }
    }
  `;
};

export const productSectionsQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
