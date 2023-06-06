import { gql } from 'graphql-request';

export const menuCategoriesQuery = (): string => {
  return gql`
    query {
      categories(first: 20, level: 0) {
        edges {
          node {
            name
            id
            slug
            products {
              totalCount
            }
            metadata {
              key
              value
            }
            children(first: 20) {
              edges {
                node {
                  name
                  id
                  metadata {
                    key
                    value
                  }
                  products {
                    totalCount
                  }
                  slug
                  children(first: 20) {
                    edges {
                      node {
                        name
                        id
                        products {
                          totalCount
                        }
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
