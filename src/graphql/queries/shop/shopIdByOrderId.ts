import { gql } from 'graphql-request';

export const shopIdByOrderIdQuery = (orderId: string): string => {
  return gql`
    query {
      marketplaceOrders(
        filter: {
          orderId: "${orderId}"
        }
      ) {
        orderBundles {
          bundle {
            shop {
              id
              name
            }
          }
        }
      }
    }
  `;
};
