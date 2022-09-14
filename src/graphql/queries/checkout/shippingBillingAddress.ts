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
