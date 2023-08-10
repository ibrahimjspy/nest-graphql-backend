import { gql } from 'graphql-request';
import { addressFragment } from 'src/graphql/fragments/checkout/shipping/shippingAddress';
import { userFragment } from 'src/graphql/fragments/user';

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
          checkoutId
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
          user {
            ... User
          }
        }
        errors {
          field
          code
        }
      }
    }
    ${addressFragment}
    ${userFragment}
  `;
};
