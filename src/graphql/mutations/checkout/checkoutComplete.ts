import { gql } from 'graphql-request';
import { addressFragment } from 'src/graphql/fragments/checkout/shipping/shippingAddress';

export const orderCreateFromCheckoutMutation = (
  checkoutId: string,
  disableCheckout = true,
) => {
  return gql`
    mutation {
      orderCreateFromCheckout(
        id: "${checkoutId}"
        removeCheckout: ${disableCheckout}
      ) {
        order {
          id
          number
          deliveryMethod {
            ... on ShippingMethod {
              id
              name
            }
          }
          lines {
            id
            variant {
              id
            }
          }
          shippingAddress {
            ... Address
          }
          billingAddress {
            ... Address
          }
        }
        errors {
          field
          code
        }
      }
    }
    ${addressFragment}
  `;
};
