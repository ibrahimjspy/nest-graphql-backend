import { gql } from 'graphql-request';

export const checkoutPromoCodeAddMutation = (
  checkoutId: string,
  promoCode: string,
) => {
  return gql`
    mutation {
      checkoutAddPromoCode(id: "${checkoutId}", promoCode: "${promoCode}") {
        errors {
          message
        }
        checkout {
          id
          discount {
            amount
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
          totalPrice {
            gross {
              amount
            }
          }
        }
      }
    }
  `;
};
