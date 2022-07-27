import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (): string => {
  return gql`
    query {
      productTypes(first: 10) {
        edges {
          node {
            name
            id
            slug
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

export const productCollectionsQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
