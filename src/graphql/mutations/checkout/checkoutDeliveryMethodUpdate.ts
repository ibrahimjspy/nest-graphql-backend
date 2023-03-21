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
