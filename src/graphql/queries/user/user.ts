import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

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
          phone
          isDefaultShippingAddress
        }
      }
    }
  `;
};

export const userQuery = (userId: string) => {
  return graphqlQueryCheck(federationQuery(userId), federationQuery(userId));
};
