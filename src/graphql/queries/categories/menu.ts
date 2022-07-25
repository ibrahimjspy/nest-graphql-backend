import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = () => {
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

const mockQuery = () => {
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
