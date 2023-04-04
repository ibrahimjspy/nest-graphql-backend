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
        shippingMethods {
          id
          name
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
        deliveryMethod {
          ... on ShippingMethod {
          id
          metadata {
            key
            value
          }
          }
          ... on Warehouse {
            __typename,
            id,
            name
          }
        }
      }
    }
  `;
};
