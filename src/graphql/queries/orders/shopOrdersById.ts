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

const mockQuery = () => {
  return gql`
    query {
      shop_orders {
        orders {
          id
          orderId
          orderBundle {
            bundleId
            orderlineIds
          }
          quantity
        }
      }
    }
  `;
};
// returns shop orders query based on federation and mock check
export const shopOrdersQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
