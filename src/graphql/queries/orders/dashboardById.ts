import { gql } from 'graphql-request';
import { graphqlQueryCheck } from '../../../public/graphqlQueryToggle';

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
export const dashboardQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
