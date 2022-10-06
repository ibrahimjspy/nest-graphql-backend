import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
    query{
      order(
        id: "${id}"
      )
      {
        number
        userEmail
        shippingAddress
        {
          streetAddress1
          streetAddress2
        }
        billingAddress
        {
          streetAddress1
          streetAddress2
        }
        customerNote
      }
    }
  `;
};
// returns shop orders query based on federation and mock check
export const shopOrderFulfillmentsQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
