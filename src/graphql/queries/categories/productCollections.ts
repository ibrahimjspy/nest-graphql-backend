import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (): string => {
  return gql`
    query {
      categories(first: 2) {
        edges {
          node {
            name
            id
            slug
            children(first: 2) {
              edges {
                node {
                  name
                  id
                  slug
                  children(first: 2) {
                    edges {
                      node {
                        name
                        id
                        slug
                      }
                    }
                  }
                }
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

export const productCollectionsQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery(), 'true');
};
