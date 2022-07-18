import { gql } from 'graphql-request';
//WARN currently no use of this query in any ql resolvers !!
export const menuCategories = () => {
  return gql`
    query {
      categories(first: 10) {
        edges {
          node {
            name
            children(first: 10) {
              edges {
                node {
                  name
                  children(first: 10) {
                    edges {
                      node {
                        name
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
