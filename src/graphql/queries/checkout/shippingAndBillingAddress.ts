import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
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

export const shippingAndBillingAddressQuery = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
