import { gql } from 'graphql-request';

export const dashboardQuery = (id?: number, specificMock?: string) => {
  console.log(id);
  if (process.env.MOCK == 'true' || specificMock == 'true') {
    // query linking with mock server
    return gql`
      query {
        user_dashboard {
          unpaid_orders
          orders_cancelled
          orders_processing
          orders_shipped
          request_returns
        }
      }
    `;
  }
  if (process.env.MOCK == 'false') {
    // query linking with backend
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
  }
};
