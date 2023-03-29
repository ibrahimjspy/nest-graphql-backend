import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = () => {
  return gql`
    query {
      me {
        id
        firstName
        lastName
        email
      }
    }
  `;
};

const b2cQuery = () => {
  return gql`
    query {
      me {
        isStaff
        userPermissions {
          name
          code
        }
        id
        firstName
        lastName
        email
        checkoutIds
        metadata {
          key
          value
        }
        addresses {
          id
          firstName
          lastName
          city
          phone
          postalCode
          companyName
          cityArea
          streetAddress1
          streetAddress2
          countryArea
          country {
            country
            code
          }
        }
        defaultBillingAddress {
          id
          firstName
          lastName
          city
          phone
          postalCode
          companyName
          cityArea
          streetAddress1
          streetAddress2
          countryArea
          country {
            country
            code
          }
        }
        defaultShippingAddress {
          id
          firstName
          lastName
          city
          phone
          postalCode
          companyName
          cityArea
          streetAddress1
          streetAddress2
          countryArea
          country {
            country
            code
          }
        }
      }
    }
  `;
};

export const userInformationQuery = () => {
  return graphqlQueryCheck(b2bQuery(), b2cQuery());
};
