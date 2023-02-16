import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (checkoutId: string) => {
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

export const orderCreateFromCheckoutMutation = (checkoutId: string) => {
  return graphqlQueryCheck(b2bQuery(checkoutId), b2bQuery(checkoutId));
};
