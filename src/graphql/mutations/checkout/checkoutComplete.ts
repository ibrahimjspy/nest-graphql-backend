import { gql } from 'graphql-request';

export const orderCreateFromCheckoutMutation = (checkoutId: string) => {
  return gql`
    mutation {
      orderCreateFromCheckout(
        id: "${checkoutId}"
        removeCheckout: false
      ) {
        order {
          id
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
