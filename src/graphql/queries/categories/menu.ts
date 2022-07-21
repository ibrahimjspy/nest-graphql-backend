import { gql } from 'graphql-request';
//WARN currently no use of this query in any ql resolvers !!
export const menuCategories = () => {
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
