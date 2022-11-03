import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

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
        }
      }
    }
  `;
};

// returns shop orders query based on federation and mock check
export const shopOrdersQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
