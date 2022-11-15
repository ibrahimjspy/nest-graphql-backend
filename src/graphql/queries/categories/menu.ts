import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (): string => {
  return gql`
    query {
      categories(first: 20, level: 0) {
        edges {
          node {
            name
            id
            slug
            children(first: 20) {
              edges {
                node {
                  name
                  id
                  slug
                  children(first: 20) {
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
      main_categories {
        name
        id
        slug
        images {
          url
          label
        }
        sub_categories {
          id
          name
          slug
          sub_sub_categories {
            id
            name
            slug
          }
        }
      }
    }
  `;
};

export const menuCategoriesQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
