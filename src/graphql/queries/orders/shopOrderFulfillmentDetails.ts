import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

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
export const shopOrderFulfillmentDetailsQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};