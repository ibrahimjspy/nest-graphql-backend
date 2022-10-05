import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
    query{
      marketplaceShop(
        filter: {
          id: "${id}"
        }
      ){
        name
        orders{
          id
          orderId
          fulfillmentStatus
        }
      }
    }
  `;
};

// returns shop orders query based on federation and mock check
export const shopOrdersQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
