import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (checkoutId: string): string => {
  return gql`
    query {
      checkout(
        id: "${checkoutId}"
      ) {
        metadata {
          key
          value
        }
        deliveryMethod {
          ... on ShippingMethod {
            name
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

const b2cQuery = b2bQuery;
export const getCheckoutShippingAddressQuery = (
  checkoutId: string,
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(checkoutId), b2cQuery(checkoutId), isB2C);
};
