import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
  query{
    marketplaceOrder(
      filter: {
        id: "${id}"
      }
    )
    {
      id
      orderId
      orderBundles{
        orderlineIds
        quantity
      }
      fulfillments{
        fulfillmentId
        fulfillmentBundles{
          fulfillmentlineIds
          quantity
        }
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
export const shopOrderFulfillmentsQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
