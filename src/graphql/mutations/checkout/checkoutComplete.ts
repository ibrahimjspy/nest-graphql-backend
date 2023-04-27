import { gql } from 'graphql-request';

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
          billingAddress {
            firstName
            lastName
            streetAddress1
            streetAddress2
            phone
            companyName
            city
            postalCode
            countryArea
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
