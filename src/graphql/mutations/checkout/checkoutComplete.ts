import { gql } from 'graphql-request';

export const orderCreateFromCheckoutMutation = (checkoutId: string) => {
  return gql`
    mutation {
      orderCreateFromCheckout(
        id: "${checkoutId}"
        removeCheckout: true
      ) {
        order {
          id
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
            firstName
            lastName
            streetAddress1
            streetAddress2
            phone
            companyName
            city
            postalCode
            country {
              code
              country
            }
          }
        }
        errors {
          field
          code
        }
      }
    }
  `;
};
