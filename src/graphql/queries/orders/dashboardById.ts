import { gql } from 'graphql-request';

export const dashboardQuery = () => {
  const is_mock = process.env.MOCK;
  if (is_mock == 'false') {
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
  } else {
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
};
