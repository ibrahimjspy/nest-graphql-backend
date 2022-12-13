import { gql } from 'graphql-request';

const federationQuery = (orderIds: string): string => {
  return gql`
    query {
      orders(first:50, filter: { ids: [${orderIds}] } ) {
        edges {
          node {
            id
            number
            created
            status
            shippingAddress{
              firstName
              lastName
            }
            shippingMethods{
               maximumDeliveryDays,
               name
            }
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
export const ordersListQuery = (orderIds: string): string => {
  return federationQuery(orderIds);
};
