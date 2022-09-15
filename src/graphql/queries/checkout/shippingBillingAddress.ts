import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
  // query linking with backend
  return gql`
  query {
    checkout(
        id: "${checkoutId}",
    ) {
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
          country
          code
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
        country {
          country
          code
        }
      }
    }
  }
  `;
};

export const shippingBillingAddressQuery = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
