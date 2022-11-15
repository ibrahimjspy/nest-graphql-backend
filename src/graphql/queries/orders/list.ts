import { gql } from 'graphql-request';

const federationQuery = (orderIds: string[]): string => {
  return gql`
    query {
      orders(first:50, filter: { ids: [${orderIds.map((id) => {
        return `"${id}"`;
      })}]} ) {
        edges {
          node {
            id
            number
            created
            status
            user {
              firstName
              lastName
              email
            }
            lines {
              variant {
                product {
                  created
                }
              }
            }
            total {
              net {
                amount
              }
            }
          }
        }
      }
    }
  `;
};

// returns shop order list query
export const ordersListQuery = (orderIds: string[]): string => {
  return federationQuery(orderIds);
};
