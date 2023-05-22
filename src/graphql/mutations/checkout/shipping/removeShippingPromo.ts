import { gql } from 'graphql-request';

export const checkoutPromoCodeRemoveMutation = (
  checkoutId: string,
  promoCode: string,
) => {
  return gql`
    mutation {
      checkoutRemovePromoCode(id: "${checkoutId}", promoCode: "${promoCode}") {
        checkout {
          id
          discount {
            amount
          }
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
          deliveryMethod {
            ... on ShippingMethod {
              id
              name
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
