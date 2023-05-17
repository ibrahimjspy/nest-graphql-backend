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