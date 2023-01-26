import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
    query {
      categories(first: ${id}) {
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
      user_dashboard {
        unpaid_orders
        orders_cancelled
        orders_processing
        orders_shipped
        request_returns
      }
    }
  `;
};
// returns order dashboard query based on federation and mock check
export const dashboardQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery(), true);
};
