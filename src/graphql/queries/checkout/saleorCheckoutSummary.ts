import { gql } from 'graphql-request';

export const saleorCheckoutSummaryQuery = (checkoutId: string): string => {
  return gql`
    query {
      checkout(id: "${checkoutId}") {
        totalPrice {
          gross {
            amount
          }
        }
        discount {
          amount
        }
        discountName
        shippingPrice {
          gross {
            amount
          }
        }
        subtotalPrice {
          gross {
            amount
          }
        }
        metadata {
          key
          value
        }
      }
    }
  `;
};
