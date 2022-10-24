import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (userId: string) => {
  return gql`
    query {
      user (
        id: "${userId}"
      ) {
        id
        email
        addresses {
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          cityArea
          postalCode
          country {
            code
            country
          }
          countryArea
          phone
          isDefaultShippingAddress
        }
      }
    }
  `;
};

export const userAddressesByIdQuery = (userId: string) => {
  return graphqlQueryCheck(federationQuery(userId), federationQuery(userId));
};