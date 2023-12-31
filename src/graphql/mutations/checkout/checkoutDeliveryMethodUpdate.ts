import { gql } from 'graphql-request';

export const checkoutDeliveryMethodUpdateMutation = (
  checkoutId: string,
  deliveryMethodId: string,
) => {
  return gql`
    mutation {
      checkoutDeliveryMethodUpdate(
      deliveryMethodId: "${deliveryMethodId}",
        id: "${checkoutId}"
      ) {
        checkout {
          id
          user {
            email
          }
          voucherCode
          deliveryMethod {
            ... on ShippingMethod {
              id
              name
              metadata {
                key
                value
              }
            }
          }
          totalPrice {
            gross {
              amount
            }
          }
          discount {
            amount
          }
          subtotalPrice {
            gross {
              amount
            }
          }
        }
        errors {
          message
        }
      }
    }
  `;
};
